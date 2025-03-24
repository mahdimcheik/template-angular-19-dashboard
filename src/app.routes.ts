import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { canNotLoginGuard } from './app/shared/guards/can-login.guard';
import { SettingsComponent } from './app/pages/settings/settings.component';
import { PaymentSuccessComponent } from './app/modules/reservation/components/payment-success/payment-success.component';
import { TeacherPublicProfileComponent } from './app/pages/landing/sub-pages/teacher-public-profile/teacher-public-profile.component';
import { MainComponent } from './app/pages/landing/sub-pages/main/main.component';
import { StudentListComponent } from './app/modules/students/student-list/student-list.component';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', component: Dashboard },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
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
    {
        path: 'home',
        component: Landing,
        loadChildren: () => import('./app/pages/landing/landing.routes')
    },

    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },

    { path: '**', redirectTo: '/notfound' }
];
