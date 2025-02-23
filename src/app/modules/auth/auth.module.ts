import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { LoginComponent } from './pages/login/login.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { GenericMessageComponent } from '../../pages/uikit/generic-message/generic-message.component';
import { MandatoryComponent } from '../../pages/uikit/mandatory/mandatory.component';
import { RequiredAsteriskDirective } from '../../shared/directives/required-asterisk.directive';
import { AccountConfirmationComponent } from './pages/account-confirmation/account-confirmation.component';
import { PasswordResetSuccessfullyComponent } from './pages/password-reset-successfully/password-reset-successfully.component';
import { FluidModule } from 'primeng/fluid';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { InscriptionComponent } from './pages/inscription/inscription.component';
import { DatePickerModule } from 'primeng/datepicker';

@NgModule({
    declarations: [LoginComponent, ForgotPasswordComponent, ChangePasswordComponent, AccountConfirmationComponent, PasswordResetSuccessfullyComponent, InscriptionComponent],
    imports: [
        CommonModule,
        AuthRoutingModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        PasswordModule,
        FormsModule,
        RouterModule,
        RippleModule,
        AppFloatingConfigurator,
        ToastModule,
        MessageModule,
        ReactiveFormsModule,
        OverlayBadgeModule,
        GenericMessageComponent,
        MandatoryComponent,
        RequiredAsteriskDirective,
        FluidModule,
        SelectModule,
        TextareaModule,
        DatePickerModule
    ],
    providers: [MessageService]
})
export class AuthModule {}
