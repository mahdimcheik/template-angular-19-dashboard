import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../../shared/services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { firstValueFrom, tap } from 'rxjs';
import { UserLoginDTO } from '../../../../shared/models/user';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';
import { CommonModule } from '@angular/common';
import { MessageModule } from 'primeng/message';
import { InputText } from 'primeng/inputtext';

@Component({
    selector: 'app-forgot-password',
    imports: [FluidModule, ButtonModule, InputText, CommonModule, ReactiveFormsModule, MessageModule, RouterModule],
    templateUrl: './forgot-password.component.html',
    styleUrl: './forgot-password.component.scss',
    providers: []
})
export class ForgotPasswordComponent {
    authService = inject(AuthService);
    canChange = signal(false);
    message = signal('');

    constructor() {}

    userForm = new FormGroup({
        email: new FormControl<string>('', [Validators.email, Validators.required])
    });

    submit() {
        this.authService
            .forgotPassword(this.userForm.value as { email: string })
            .pipe(
                tap((res) => {
                    if (res.status === 200) {
                        this.canChange.set(true);
                        this.message.set(res.message);
                    }
                })
            )
            .subscribe();
    }
}
