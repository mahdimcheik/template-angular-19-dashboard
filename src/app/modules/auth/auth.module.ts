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

@NgModule({
    declarations: [LoginComponent, ForgotPasswordComponent, ChangePasswordComponent],
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
        RequiredAsteriskDirective
    ],
    providers: [MessageService]
})
export class AuthModule {}
