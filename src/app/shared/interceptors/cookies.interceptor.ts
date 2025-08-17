import { HttpInterceptorFn } from '@angular/common/http';
/**
 * Intercepteur : qui sert à ajouter les cookies à chaque requête HTTP.
 * @param req la requête HTTP à modifier.
 * @param next le prochain intercepteur dans la chaîne.
 * @returns la requête modifiée avec les informations d'identification.
 */
export const cookiesInterceptor: HttpInterceptorFn = (req, next) => {
    const modifiedReq = req.clone({
        withCredentials: true
    });
    return next(modifiedReq);
};
