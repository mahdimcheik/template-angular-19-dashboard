import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { SettingsComponent } from './app/pages/settings/settings.component';
import { PaymentSuccessComponent } from './app/modules/reservation/components/payment-success/payment-success.component';
import { StudentListComponent } from './app/modules/students/student-list/student-list.component';
import { canNotLoginGuard, isConnectedGuard, isNotConnectedGuard } from './app/shared/guards/can-login.guard';
import { Dashboard } from './app/modules/dashboard/dashboard';
import { isAdminOnlyGuard } from './app/shared/guards/is-admin-only.guard';
import { ContactComponent } from './app/modules/contact/contact/contact.component';
import { PaymentFailedComponent } from './app/modules/reservation/pages/payment-failed/payment-failed.component';

// Define path constants
const DASHBOARD_PATH = 'dashboard';
const SETTINGS_PATH = 'settings';
const STUDENTS_LIST_PATH = 'students-list';
const CONTACT_PATH = 'contact';
const RESERVATION_PATH = 'reservation';
const PROFILE_PATH = 'profile';
const SUCCESS_PATH = 'success';
const CANCEL_PATH = 'cancel';

export const appRoutes: Routes = [
    {
        path: '',
        component: Landing,
        loadChildren: () => import('./app/pages/landing/landing.routes')
    },
    {
        path: DASHBOARD_PATH,
        component: AppLayout,
        canActivate: [isConnectedGuard],
        children: [
            { path: '', component: Dashboard },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },

            { path: SETTINGS_PATH, component: SettingsComponent },
            {
                path: RESERVATION_PATH,
                loadChildren: () => import('./app/modules/reservation/reservation.routes')
            },
            {
                path: PROFILE_PATH,
                loadChildren: () => import('./app/modules/profile/profile.routes')
            },
            {
                path: SUCCESS_PATH,
                component: PaymentSuccessComponent
            },
            {
                path: CANCEL_PATH,
                component: PaymentFailedComponent
            },
            {
                path: STUDENTS_LIST_PATH,
                component: StudentListComponent,
                canActivate: [isAdminOnlyGuard]
            },
            {
                path: CONTACT_PATH,
                component: ContactComponent
            }
        ]
    },
    {
        path: 'auth',
        canActivate: [isNotConnectedGuard],
        loadChildren: () => import('./app/modules/auth/auth.routes')
    },

    {
        // Import auth routes from ./app/modules/auth/auth.routes.ts file
        path: '',
        loadChildren: () => import('./app/modules/auth/auth.routes')
    },
    {
        path: 'notfound',
        component: Notfound
    },
    { path: '**', redirectTo: '/notfound' }
];
