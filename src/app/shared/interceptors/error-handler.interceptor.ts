//

import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, finalize, switchMap, throwError } from 'rxjs';
import { of } from 'rxjs';
import { MessageService } from 'primeng/api';
import { AuthService } from '../services/auth.service';
import { LocalstorageService } from '../services/localstorage.service';
import { GlobalService } from '../services/global.service';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
    let isRefreshing = false;
    const authService = inject(AuthService);
    const isFetching = inject(GlobalService).isFetching;

    isFetching.set(true);
    // Ne pas intercepter les appels vers le refresh token
    if (req.url.includes('/refresh-token')) {
        isFetching.set(false);
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
                        isFetching.set(false);
                    })
                );
            }

            isFetching.set(false);
            return throwError(() => err);
        }),
        finalize(() => {
            isFetching.set(false);
        })
    );
};
