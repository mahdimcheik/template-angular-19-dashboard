import { Routes } from '@angular/router';
import { ProfileComponent } from './pages/profile/profile.component';
import { ProfileStudentPublicComponent } from './pages/profile-student-public/profile-student-public.component';
import { isAdminOnlyGuard } from '../../shared/guards/is-admin-only.guard';
import { isConnectedGuard } from '../../shared/guards/can-login.guard';

export default [
    {
        path: 'user/:userId',
        component: ProfileStudentPublicComponent,
        canActivate: [isConnectedGuard, isAdminOnlyGuard]
    },
    {
        path: 'me',
        component: ProfileComponent,
        canActivate: [isConnectedGuard]
    }
] as Routes;
