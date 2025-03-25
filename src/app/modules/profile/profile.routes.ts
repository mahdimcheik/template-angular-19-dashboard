import { Routes } from '@angular/router';
import { ProfileComponent } from './pages/profile/profile.component';

export default [
    {
        path: ':userId',
        component: ProfileComponent
    }
] as Routes;
