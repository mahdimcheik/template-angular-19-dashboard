import { Component, inject, signal } from '@angular/core';
import { UserMainService } from '../../../../shared/services/userMain.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { catchError, finalize } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';
import { CommonModule } from '@angular/common';
import { MessageModule } from 'primeng/message';
import { InputText } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-forgot-password',
    imports: [FluidModule, ButtonModule, InputText, CommonModule, ReactiveFormsModule, MessageModule, RouterModule],
    templateUrl: './forgot-password.component.html',
    styleUrl: './forgot-password.component.scss',
    providers: []
})
export class ForgotPasswordComponent {
    authService = inject(UserMainService);
    messageService = inject(MessageService);
    router = inject(Router);
    message = '';
    errorRegistration = false;
    isLoading = false;

    userForm = new FormGroup({
        email: new FormControl<string>('', [Validators.email, Validators.required])
    });

    submit() {
        this.isLoading = true;
        (this.authService as any)
            .forgotPassword(this.userForm.value as { email: string })
            .pipe(
                catchError((err) => {
                    this.errorRegistration = true;
                    this.message = (err as any).error.message;
                    return err;
                }),
                finalize(() => {
                    setTimeout(() => {
                        this.isLoading = false;
                    }, 500);
                })
            )
            .subscribe(() => {
                this.errorRegistration = false;
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Un email vous a été envoyé pour réinitialiser votre mot de passe' });
                this.message = 'Un email vous a été envoyé pour réinitialiser votre mot de passe';
                this.router.navigateByUrl('/home');
            });
    }
}
