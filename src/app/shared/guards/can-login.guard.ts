import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LocalstorageService } from '../services/localstorage.service';

export const canNotLoginGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const localStorageService = inject(LocalstorageService);
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
    const authService = inject(AuthService);
    if (authService.userConnected().email) return false;
    return true;
};

export const isConnectedGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    if (authService.userConnected().email) return true;
    router.navigateByUrl('/auth/login');
    return false;
};
