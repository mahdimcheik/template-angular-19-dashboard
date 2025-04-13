import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LocalstorageService } from '../services/localstorage.service';
import { firstValueFrom } from 'rxjs';

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

export const isConnectedGuard: CanActivateFn = async (route, state) => {
    const authService = inject(AuthService);
    // Check if the user is connected , dans la mémoire
    const router = inject(Router);
    if (authService.userConnected().email) {
        return true;
    }

    await firstValueFrom(authService.refreshToken());
    if (authService.userConnected().email) {
        return true;
    }
    return false;
};
