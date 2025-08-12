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
    router = inject(Router);
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
        hideSubmitButton: true,
        hideCancelButton: true,
        styleClass: 'max-w-[40rem] ',
        formFieldGroups: [
            {
                id: 'login',
                name: 'login',
                description: 'Veuillez remplir les champs obligatoires',
                fields: [
                    {
                        id: 'email',
                        name: 'email',
                        label: 'Email',
                        type: 'text',
                        placeholder: 'Email',
                        required: true,
                        fullWidth: true,
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
                        fullWidth: true,
                        validation: [Validators.required, Validators.minLength(8)],
                        order: 2
                    }
                ]
            }
        ]
    };

    // Handle form submission from configurable form
    handleFormSubmit(formGroup: FormGroup) {
        const formData = formGroup.value;
        const loginData = {
            email: formData.login.email,
            password: formData.login.password
        };

        this.loginWithData(loginData);
    }

    // Original submit method (now private)
    private loginWithData(loginData: UserLoginDTO) {
        (this.authService as any)
            .login(loginData)
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

    // Keep the original submit method for backward compatibility (if needed)
    submit() {
        this.loginWithData(this.userForm.value as UserLoginDTO);
    }
}
