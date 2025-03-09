import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../../shared/services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, finalize, firstValueFrom, tap } from 'rxjs';
import { UserLoginDTO, UserResponseDTO } from '../../../../shared/models/user';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-login',
    standalone: false,
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    providers: []
})
export class LoginComponent implements OnInit {
    private authService = inject(AuthService);
    private messageService = inject(MessageService);
    private router = inject(Router);
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
