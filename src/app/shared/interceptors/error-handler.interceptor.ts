//

import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { of } from 'rxjs';
import { MessageService } from 'primeng/api';
import { AuthService } from '../services/auth.service';
import { LocalstorageService } from '../services/localstorage.service';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
    const messageService = inject(MessageService);
    const authService = inject(AuthService);
    const localStorageService = inject(LocalstorageService);

    return next(req).pipe(
        catchError((err: any) => {
            // Handle 401 Unauthorized error
            console.log('newTokens err', err);

            if (err.status === 401) {
                return authService.refreshToken().pipe(
                    catchError((refreshErr) => {
                        messageService.add({
                            severity: 'error',
                            summary: 'Session Expired',
                            detail: 'Please log in again.'
                        });
                        return throwError(() => refreshErr);
                    }),
                    switchMap((newTokens) => {
                        console.log('newTokens', newTokens);
                        const clonedRequest = req.clone({
                            setHeaders: {
                                Authorization: `Bearer ${newTokens.data.accessToken}`
                            }
                        });

                        // Retry the original request with the updated token
                        return next(clonedRequest);
                    }),
                    catchError((refreshErr) => {
                        messageService.add({
                            severity: 'error',
                            summary: 'Session Expired',
                            detail: 'Please log in again.'
                        });
                        return throwError(() => refreshErr);
                    })
                );
            }

            // For other errors, show a generic error message
            messageService.add({
                severity: 'error',
                summary: 'Attention ! ',
                detail: err.error?.message ?? 'Erreur coté serveur'
            });

            return throwError(() => err);
        })
    );
};
