//

import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { of } from 'rxjs';
import { MessageService } from 'primeng/api';
import { AuthService } from '../services/auth.service';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
    const messageService = inject(MessageService);
    const authService = inject(AuthService);

    return next(req).pipe(
        catchError((err: any) => {
            // Handle 401 Unauthorized error
            console.log('newTokens', err);

            if (err.status === 401) {
                return authService.refreshToken().pipe(
                    switchMap((newTokens) => {
                        console.log('newTokens', newTokens);
                        authService.token.set(newTokens.accessToken);
                        authService.refreshAccessToken.set(newTokens.refreshToken);

                        // Update the Authorization header with the new access token
                        const clonedRequest = req.clone({
                            setHeaders: {
                                Authorization: `Bearer ${newTokens.accessToken}`
                            }
                        });

                        // Retry the original request with the updated token
                        return next(clonedRequest);
                    }),
                    catchError((refreshErr) => {
                        // If refresh token fails, log out the user
                        messageService.add({
                            severity: 'error',
                            summary: 'Session Expired',
                            detail: 'Please log in again.'
                        });
                        authService.logout();

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
