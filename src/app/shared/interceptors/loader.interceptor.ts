import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoaderService } from '../services/loader.service';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
    const loaderService = inject(LoaderService);

    const dontShowLoader = req.headers.get('X-Show-Loader') === 'false';

    if (dontShowLoader) {
        return next(req);
    }

    loaderService.show();
    return next(req).pipe(finalize(() => loaderService.hide()));
};
