import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../shared/services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { UserLoginDTO } from '../../../../shared/models/user';

@Component({
    selector: 'app-login',
    standalone: false,
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    providers: [AuthService]
})
export class LoginComponent {
    private authService = inject(AuthService);
    private router = inject(Router);

    userForm = new FormGroup({
        email: new FormControl<string>('', [Validators.email, Validators.required]),
        password: new FormControl<string>('', [Validators.required, Validators.minLength(8)])
    });

    async submit() {
        await firstValueFrom(this.authService.login(this.userForm.value as UserLoginDTO));
    }
}
