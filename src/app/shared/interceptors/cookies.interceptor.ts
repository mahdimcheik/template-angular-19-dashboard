import { HttpInterceptorFn } from '@angular/common/http';

export const cookiesInterceptor: HttpInterceptorFn = (req, next) => {
    const modifiedReq = req.clone({
        withCredentials: true
    });
    return next(modifiedReq);
};
