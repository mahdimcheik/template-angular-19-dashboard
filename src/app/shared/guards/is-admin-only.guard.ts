import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

export const isAdminOnlyGuard: CanActivateFn = async (route, state) => {
    var auth = inject(AuthService);
    if (auth.userConnected().email) {
        if (auth.userConnected().roles.includes('Admin')) {
            return true;
        } else {
            return false;
        }
    }

    try {
        await firstValueFrom(auth.refreshToken());
        if (auth.userConnected().email && auth.userConnected().roles.includes('Admin')) {
            return true;
        }
        return false;
    } catch {
        return false;
    }
};

export const isStudentOnlyGuard: CanActivateFn = async (route, state) => {
    var auth = inject(AuthService);
    if (auth.userConnected().email) {
        if (auth.userConnected().roles.includes('Student')) {
            return true;
        } else {
            return false;
        }
    }

    try {
        await firstValueFrom(auth.refreshToken());
        if (auth.userConnected().email && auth.userConnected().roles.includes('Student')) {
            return true;
        }
        return false;
    } catch {
        return false;
    }
};
