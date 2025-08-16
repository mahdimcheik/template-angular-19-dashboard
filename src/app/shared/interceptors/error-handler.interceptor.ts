import { HttpEvent, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { catchError, finalize, Observable, switchMap, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { UserMainService } from '../services/userMain.service';
import { environment } from '../../../environments/environment';

// Move isRefreshing outside the interceptor function to share across all requests
let isRefreshing = false;

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(UserMainService);

    // Only intercept API calls (not static assets or other requests)
    const isApiCall = req.url.includes('/api/') || req.url.includes(environment.BACK_URL);

    // Don't intercept refresh token calls or non-API requests
    if (req.url.includes('/refresh-token') || !isApiCall) {
        return next(req);
    }

    return next(req).pipe(
        catchError((err: any) => {
            console.log('API error caught: ' + err.message);

            // Only handle 401 errors for API calls and when not already refreshing
            if (err.status === 401 && !isRefreshing) {
                isRefreshing = true;

                return authService.refreshToken().pipe(
                    catchError((refreshErr) => {
                        isRefreshing = false;
                        // If refresh token fails, redirect to login
                        authService.reset();
                        return throwError(() => refreshErr);
                    }),
                    switchMap(() => {
                        const clonedRequest = req.clone({
                            setHeaders: {
                                Authorization: `Bearer ${authService.token()}`
                            }
                        });
                        return next(clonedRequest);
                    }),
                    finalize(() => {
                        isRefreshing = false;
                    })
                );
            }

            return throwError(() => err);
        })
    ) as Observable<HttpEvent<any>>;
};
