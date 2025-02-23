import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const isAdminOnlyGuard: CanActivateFn = (route, state) => {
    var auth = inject(AuthService);
    if (!!auth.userConnected().email && auth.userConnected().roles.includes('Admin')) {
        return true;
    }
    return false;
};
