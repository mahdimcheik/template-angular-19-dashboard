import { Routes } from '@angular/router';
import { ProfileComponent } from './pages/profile/profile.component';
import { AuthLayoutComponent } from '../auth/pages/auth-layout/auth-layout.component';

export default [
    {
        path: '',
        component: ProfileComponent
    }
] as Routes;
