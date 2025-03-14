import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './pages/auth-layout/auth-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { AccountConfirmationComponent } from './pages/account-confirmation/account-confirmation.component';
import { InscriptionComponent } from './pages/inscription/inscription.component';
import { AccountCreatedSuccessfullyComponent } from './pages/account-created-successfully/account-created-successfully.component';
import { canNotLoginGuard } from '../../shared/guards/can-login.guard';

export default [
    {
        path: '',
        component: AuthLayoutComponent,
        children: [
            {
                path: 'login',
                component: LoginComponent,
                canActivate: [canNotLoginGuard]
            },
            {
                path: 'forgot-password',
                component: ForgotPasswordComponent,
                canActivate: [canNotLoginGuard]
            },
            {
                path: 'reset-password',
                component: ChangePasswordComponent,
                canActivate: [canNotLoginGuard]
            },
            {
                path: 'email-confirmation-success',
                component: AccountConfirmationComponent
            },
            {
                path: 'inscription',
                component: InscriptionComponent,
                canActivate: [canNotLoginGuard]
            },
            {
                path: 'account-created-successfully',
                component: AccountCreatedSuccessfullyComponent
                // canActivate: [canNotLoginGuard]
            }
        ]
    }
] as Routes;
