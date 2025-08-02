import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { SettingsComponent } from './app/pages/settings/settings.component';
import { PaymentSuccessComponent } from './app/modules/reservation/components/payment-success/payment-success.component';
import { StudentListComponent } from './app/modules/students/student-list/student-list.component';
import { canNotLoginGuard, isConnectedGuard, isNotConnectedGuard } from './app/shared/guards/can-login.guard';
import { Dashboard } from './app/modules/dashboard/dashboard';
import { isAdminOnlyGuard, isStudentOnlyGuard } from './app/shared/guards/is-admin-only.guard';
import { ContactComponent } from './app/modules/contact/contact/contact.component';
import { PaymentFailedComponent } from './app/modules/reservation/pages/payment-failed/payment-failed.component';

// Auth components
import { AuthLayoutComponent } from './app/modules/auth/pages/auth-layout/auth-layout.component';
import { LoginComponent } from './app/modules/auth/pages/login/login.component';
import { ForgotPasswordComponent } from './app/modules/auth/pages/forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './app/modules/auth/pages/change-password/change-password.component';
import { AccountConfirmationComponent } from './app/modules/auth/pages/account-confirmation/account-confirmation.component';
import { InscriptionComponent } from './app/modules/auth/pages/inscription/inscription.component';
import { AccountCreatedSuccessfullyComponent } from './app/modules/auth/pages/account-created-successfully/account-created-successfully.component';
import { PasswordResetSuccessfullyComponent } from './app/modules/auth/pages/password-reset-successfully/password-reset-successfully.component';

// Landing components
import { MainComponent } from './app/pages/landing/sub-pages/main/main.component';
import { TeacherPublicProfileComponent } from './app/pages/landing/sub-pages/teacher-public-profile/teacher-public-profile.component';
import { MentionsLegalesComponent } from './app/pages/landing/sub-pages/mentions-legales/mentions-legales.component';
import { TestPageComponent } from './app/pages/landing/sub-pages/test-page/test-page.component';

// Profile components
import { ProfileComponent } from './app/modules/profile/pages/profile/profile.component';
import { ProfileStudentPublicComponent } from './app/modules/profile/pages/profile-student-public/profile-student-public.component';

// Reservation components
import { CalendarForTeacherComponent } from './app/modules/reservation/pages/calendar-for-teacher/calendar-for-teacher.component';
import { CalendarForStudentComponent } from './app/modules/reservation/pages/calendar-for-student/calendar-for-student.component';
import { ReservationsListDetailedComponent } from './app/modules/reservation/components/reservations-list-detailed/reservations-list-detailed.component';
import { OrdersComponent } from './app/modules/reservation/pages/orders/orders.component';

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
    // Landing routes
    {
        path: '',
        component: Landing,
        children: [
            {
                path: '',
                component: MainComponent
            },
            {
                path: 'teacher',
                component: TeacherPublicProfileComponent
            },
            {
                path: 'mentions-legales',
                component: MentionsLegalesComponent
            },
            {
                path: 'test',
                component: TestPageComponent
            }
        ]
    },

    // Auth routes
    {
        path: 'auth',
        component: AuthLayoutComponent,
        canActivate: [isNotConnectedGuard],
        children: [
            {
                path: 'login',
                component: LoginComponent
            },
            {
                path: 'forgot-password',
                component: ForgotPasswordComponent
            },
            {
                path: 'reset-password',
                component: ChangePasswordComponent
            },
            {
                path: 'email-confirmation-success',
                component: AccountConfirmationComponent
            },
            {
                path: 'inscription',
                component: InscriptionComponent
            },
            {
                path: 'account-created-successfully',
                component: AccountCreatedSuccessfullyComponent
            },
            {
                path: 'password-reset-successfully',
                component: PasswordResetSuccessfullyComponent
            }
        ]
    },

    // Dashboard routes (protected)
    {
        path: DASHBOARD_PATH,
        component: AppLayout,
        canActivate: [isConnectedGuard],
        children: [
            { path: '', component: Dashboard },

            // Settings
            { path: SETTINGS_PATH, component: SettingsComponent },

            // Contact
            { path: CONTACT_PATH, component: ContactComponent },

            // Payment results
            { path: SUCCESS_PATH, component: PaymentSuccessComponent },
            { path: CANCEL_PATH, component: PaymentFailedComponent },

            // Students list (admin only)
            {
                path: STUDENTS_LIST_PATH,
                component: StudentListComponent,
                canActivate: [isAdminOnlyGuard]
            },

            // Profile routes
            {
                path: PROFILE_PATH,
                children: [
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
                ]
            },

            // Reservation routes
            {
                path: RESERVATION_PATH,
                children: [
                    {
                        path: 'calendar-for-teacher',
                        component: CalendarForTeacherComponent,
                        canActivate: [isAdminOnlyGuard]
                    },
                    {
                        path: 'calendar-for-student',
                        component: CalendarForStudentComponent,
                        canActivate: [isStudentOnlyGuard]
                    },
                    {
                        path: 'list',
                        component: ReservationsListDetailedComponent
                    },
                    {
                        path: 'orders-student',
                        component: OrdersComponent,
                        canActivate: [isStudentOnlyGuard]
                    }
                ]
            }
        ]
    },

    // Not found route
    {
        path: 'notfound',
        component: Notfound
    },

    // Catch all route
    { path: '**', redirectTo: '/notfound' }
];
