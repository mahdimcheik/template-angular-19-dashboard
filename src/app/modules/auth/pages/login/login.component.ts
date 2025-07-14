import { Component, inject, OnInit } from '@angular/core';
import { UserMainService } from '../../../../shared/services/userMain.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { catchError } from 'rxjs';
import { UserLoginDTO } from '../../../../shared/services/userMain.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';
import { CommonModule } from '@angular/common';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { LogoComponent } from '../../../../pages/landing/components/logo/logo.component';
import { Structure } from '../../../../generic-components/configurable-form/related-models';
import { ConfigurableFormComponent } from '../../../../generic-components/configurable-form/configurable-form.component';

@Component({
    selector: 'app-login',
    imports: [FluidModule, ButtonModule, CommonModule, ReactiveFormsModule, MessageModule, RouterModule, PasswordModule, InputTextModule, LogoComponent, ConfigurableFormComponent],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    providers: []
})
export class LoginComponent implements OnInit {
    private authService = inject(UserMainService);
    private messageService = inject(MessageService);
    private router = inject(Router);
    badCredentials = false;
    ngOnInit(): void {
        console.log('LoginComponent initialized', (this.authService as any).userConnected());
    }

    userForm = new FormGroup({
        email: new FormControl<string>('', [Validators.email, Validators.required]),
        password: new FormControl<string>('', [Validators.required, Validators.minLength(8)])
    });

    loginFormStructure: Structure = {
        id: 'login',
        name: 'login',
        label: 'Connexion',
        formFieldGroups: [
            {
                id: 'login',
                name: 'login',
                description: 'Veuillez remplir les champs obligatoires',
                styleClass: 'min-w-[30rem]',
                fields: [
                    {
                        id: 'email',
                        name: 'email',
                        label: 'Email',
                        type: 'text',
                        placeholder: 'Email',
                        required: true,
                        validation: [Validators.email, Validators.required],
                        order: 1
                    },
                    {
                        id: 'password',
                        name: 'password',
                        label: 'Mot de passe',
                        type: 'password',
                        placeholder: 'Mot de passe',
                        required: true,
                        validation: [Validators.required, Validators.minLength(8)],
                        order: 2
                    }
                ]
            }
        ]
    };

    submit() {
        (this.authService as any)
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

                this.router.navigate(['/']);
            });
    }
}
