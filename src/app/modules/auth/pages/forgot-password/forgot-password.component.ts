import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../../shared/services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom, tap } from 'rxjs';
import { UserLoginDTO } from '../../../../shared/models/user';

@Component({
    selector: 'app-forgot-password',
    standalone: false,
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
