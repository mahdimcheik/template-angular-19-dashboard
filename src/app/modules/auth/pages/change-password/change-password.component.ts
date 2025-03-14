import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordStrengthValidator, passwordValidator } from '../../../../shared/validators/confirmPasswordValidator';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, firstValueFrom, tap } from 'rxjs';
import { AuthService } from '../../../../shared/services/auth.service';
import { UserChangePasswordDTO } from '../../../../shared/models/user';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { RequiredAsteriskDirective } from '../../../../shared/directives/required-asterisk.directive';
import { CommonModule } from '@angular/common';
@Component({
    selector: 'app-change-password',
    imports: [FluidModule, ButtonModule, CommonModule, PasswordModule, InputTextModule, RequiredAsteriskDirective, MessageModule, InputTextModule, ToastModule, SelectModule, PasswordModule, FormsModule, ReactiveFormsModule],
    templateUrl: './change-password.component.html',
    styleUrl: './change-password.component.scss',
    providers: []
})
export class ChangePasswordComponent implements OnInit {
    visible: boolean = false;
    private authService = inject(AuthService);
    private activatedRoute = inject(ActivatedRoute);
    private router = inject(Router);

    userForm = new FormGroup(
        {
            userId: new FormControl<string>(''),
            resetToken: new FormControl<string>(''),
            password: new FormControl<string>('', [Validators.required, Validators.minLength(8), passwordStrengthValidator]),
            passwordConfirmation: new FormControl<string>('', [Validators.required])
        },
        { validators: [passwordValidator('password', 'passwordConfirmation')] }
    );

    ngOnInit(): void {
        let userId = this.activatedRoute.snapshot.queryParams['userId'] ?? '';
        let resetToken = this.activatedRoute.snapshot.queryParams['resetToken'] ?? '';
        this.userForm.setValue({
            userId: userId,
            resetToken: resetToken,
            password: '',
            passwordConfirmation: ''
        });
    }

    async submit() {
        await firstValueFrom(
            this.authService.resetPassword(this.userForm.value as UserChangePasswordDTO).pipe(
                delay(1000),
                tap((res) => {
                    this.router.navigateByUrl('/');
                })
            )
        );
    }
}
