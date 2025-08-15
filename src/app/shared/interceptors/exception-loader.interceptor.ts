import { HttpInterceptorFn } from '@angular/common/http';
import { exceptionList } from './exception-url';

export const exceptionLoaderInterceptor: HttpInterceptorFn = (req, next) => {
    if (exceptionList.some((url) => req.url.includes(url))) {
        req = req.clone({
            setHeaders: { 'X-Show-Loader': 'false' }
        });
    }
    return next(req);
};
