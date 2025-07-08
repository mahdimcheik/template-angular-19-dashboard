import { HttpEvent, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { catchError, finalize, Observable, switchMap, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { UserMainService } from '../services/userMain.service';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
    let isRefreshing = false;
    const authService = inject(UserMainService);

    // Don't intercept refresh token calls
    if (req.url.includes('/refresh-token')) {
        return next(req); // ✅ Correct type
    }

    return next(req).pipe(
        catchError((err: any) => {
            console.log('error caught: ' + err.message);

            if (err.status === 401 && !isRefreshing) {
                isRefreshing = true;

                return authService.refreshToken().pipe(
                    catchError((refreshErr) => {
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
