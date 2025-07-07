import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, finalize, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
    let isRefreshing = false;
    const authService = inject(AuthService);

    // Ne pas intercepter les appels vers le refresh token
    if (req.url.includes('/refresh-token')) {
        return next(req);
    }

    return next(req).pipe(
        catchError((err: any) => {
            // cas où le rejet est dû à un token expiré
            if (err.status === 401 && !isRefreshing) {
                isRefreshing = true;
                return authService.refreshToken().pipe(
                    catchError((refreshErr) => {
                        return throwError(() => refreshErr);
                    }),
                    switchMap((newTokens) => {
                        const clonedRequest = req.clone({
                            setHeaders: {
                                Authorization: `Bearer ${authService.token()}`
                            }
                        });
                        // relancer l'ancienne requette avec le nouveau token
                        return next(clonedRequest);
                    }),
                    finalize(() => {
                        isRefreshing = false;
                    })
                );
            }

            return throwError(() => err);
        })
    );
};
