import { Routes } from '@angular/router';
import { ProfileComponent } from './pages/profile/profile.component';
import { ProfileStudentPublicComponent } from './pages/profile-student-public/profile-student-public.component';

export default [
    {
        path: 'user/:userId',
        component: ProfileStudentPublicComponent
    },
    {
        path: 'me',
        component: ProfileComponent
    }
] as Routes;
