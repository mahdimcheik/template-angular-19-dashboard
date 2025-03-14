import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../../shared/services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { catchError, finalize, firstValueFrom, tap } from 'rxjs';
import { UserLoginDTO, UserResponseDTO } from '../../../../shared/models/user';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';
import { CommonModule } from '@angular/common';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-login',
    imports: [FluidModule, ButtonModule, CommonModule, ReactiveFormsModule, MessageModule, RouterModule, PasswordModule, InputTextModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    providers: []
})
export class LoginComponent implements OnInit {
    private authService = inject(AuthService);
    private messageService = inject(MessageService);
    private router = inject(Router);
    badCredentials = false;
    ngOnInit(): void {
        console.log('LoginComponent initialized', this.authService.userConnected());
    }

    userForm = new FormGroup({
        email: new FormControl<string>('', [Validators.email, Validators.required]),
        password: new FormControl<string>('', [Validators.required, Validators.minLength(8)])
    });

    submit() {
        this.authService
            .login(this.userForm.value as UserLoginDTO)
            .pipe(
                catchError((err) => {
                    console.error(err);
                    this.messageService.add({
                        summary: 'Erreur',
                        detail: (err as any).error.message,
                        severity: 'error'
                    });
                    this.badCredentials = true;
                    throw err;
                })
            )
            .subscribe(() => {
                this.messageService.add({
                    summary: 'Connexion réussie',
                    detail: `Bienvenue `,
                    severity: 'success'
                });

                this.router.navigateByUrl('/');
            });
    }
}
