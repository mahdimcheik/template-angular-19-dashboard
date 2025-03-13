import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './pages/auth-layout/auth-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { AccountConfirmationComponent } from './pages/account-confirmation/account-confirmation.component';
import { InscriptionComponent } from './pages/inscription/inscription.component';
import { AccountCreatedSuccessfullyComponent } from './pages/account-created-successfully/account-created-successfully.component';

export default [
    {
        path: '',
        component: AuthLayoutComponent,
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
            }
        ]
    }
] as Routes;
