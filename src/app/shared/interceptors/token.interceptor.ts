import { HttpInterceptorFn } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserMainService } from '../services/userMain.service';

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
    const token = inject(UserMainService).token();

    const authReq = req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
    });
    return next(authReq);
};
