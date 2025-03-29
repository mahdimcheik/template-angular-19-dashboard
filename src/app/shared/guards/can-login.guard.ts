import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LocalstorageService } from '../services/localstorage.service';

export const canNotLoginGuard: CanActivateFn = (route, state) => {
    let authService = inject(AuthService);
    let localStorageService = inject(LocalstorageService);
    if (authService.userConnected().email) {
        return false;
    } else {
        if (localStorageService.getUser().email) {
            return false;
        }
    }
    return true;
};

export const canNotRegisterGuard: CanActivateFn = (route, state) => {
    let authService = inject(AuthService);
    if (authService.userConnected().email) return false;
    return true;
};

export const isConnectedGuard: CanActivateFn = (route, state) => {
    let authService = inject(AuthService);
    if (authService.userConnected().email) return true;
    return false;
};
