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
            // cas où le rejet est dû à un token expiré
            if (err.status === 401) {
                return authService.refreshToken().pipe(
                    catchError((refreshErr) => {
                        // messageService.add({
                        //     severity: 'error',
                        //     summary: 'Token expiré',
                        //     detail: 'Essayer de vous reconnecter.'
                        // });
                        return throwError(() => refreshErr);
                    }),
                    switchMap((newTokens) => {
                        const clonedRequest = req.clone({
                            setHeaders: {
                                Authorization: `Bearer ${newTokens.data.accessToken}`
                            }
                        });

                        // relancer l'ancienne requette avec le nouveau token
                        return next(clonedRequest);
                    }),
                    // si le refresh token a échoué
                    catchError((refreshErr) => {
                        return throwError(() => refreshErr);
                    })
                );
            }

            // Pour les autres erreurs
            // messageService.add({
            //     severity: 'error',
            //     summary: 'Attention ! ',
            //     detail: err.error?.message ?? 'Erreur coté serveur'
            // });

            return throwError(() => err);
        })
    );
};
