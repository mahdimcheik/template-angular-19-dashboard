import { Routes } from '@angular/router';
import { ProfileComponent } from './pages/profile/profile.component';
import { AuthLayoutComponent } from '../auth/pages/auth-layout/auth-layout.component';
import { canNotLoginGuard, isConnectedGuard } from '../../shared/guards/can-login.guard';

export default [
    {
        path: '',
        component: ProfileComponent,
        canActivate: [isConnectedGuard]
    }
] as Routes;
