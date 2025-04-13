import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { SettingsComponent } from './app/pages/settings/settings.component';
import { PaymentSuccessComponent } from './app/modules/reservation/components/payment-success/payment-success.component';
import { StudentListComponent } from './app/modules/students/student-list/student-list.component';
import { isConnectedGuard } from './app/shared/guards/can-login.guard';
import { Dashboard } from './app/modules/dashboard/dashboard';

export const appRoutes: Routes = [
    {
        path: '',
        component: Landing,
        loadChildren: () => import('./app/pages/landing/landing.routes')
    },
    {
        path: 'dashboard',
        component: AppLayout,
        canActivate: [isConnectedGuard],
        children: [
            { path: '', component: Dashboard },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
            { path: 'settings', component: SettingsComponent },
            {
                path: 'reservation',
                loadChildren: () => import('./app/modules/reservation/reservation.routes')
            },
            {
                path: 'profile',
                loadChildren: () => import('./app/modules/profile/profile.routes')
            },
            {
                path: 'success',
                component: PaymentSuccessComponent
            },
            {
                path: 'students-list',
                component: StudentListComponent
            }
        ]
    },
    {
        path: 'auth',
        loadChildren: () => import('./app/modules/auth/auth.routes')
    },

    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },

    { path: '**', redirectTo: '/notfound' }
];
