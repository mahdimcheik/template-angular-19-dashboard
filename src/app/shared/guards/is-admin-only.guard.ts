import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

export const isAdminOnlyGuard: CanActivateFn = async (route, state) => {
    var auth = inject(AuthService);
    if (!!auth.userConnected().email && auth.userConnected().roles.includes('Admin')) {
        return true;
    }
    const refreshToken = getCookie('refreshToken');
    if (!refreshToken) {
        return false;
    }

    // If the user is not connected, try to refresh the token
    await firstValueFrom(auth.refreshToken());
    if (auth.userConnected().roles.includes('Admin')) {
        return true;
    }
    return false;
};

export const isStudentOnlyGuard: CanActivateFn = async (route, state) => {
    var auth = inject(AuthService);
    if (!!auth.userConnected().email && auth.userConnected().roles.includes('Student')) {
        return true;
    }

    const refreshToken = getCookie('refreshToken');
    if (!refreshToken) {
        return false;
    }

    // If the user is not connected, try to refresh the token
    await firstValueFrom(auth.refreshToken());
    if (auth.userConnected().roles.includes('Student')) {
        return true;
    }
    return false;
};

function getCookie(name: string): string | null {
    const value = document.cookie
        .split('; ')
        .find((row) => row.startsWith(name + '='))
        ?.split('=')[1];

    return value ? decodeURIComponent(value) : null;
}
