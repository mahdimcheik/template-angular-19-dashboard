import { Component, inject, OnInit } from '@angular/core';
import { UserMainService } from '../../../../shared/services/userMain.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { finalize, firstValueFrom, tap } from 'rxjs';
import { EnumGender, GenderDropDown } from '../../../../shared/models/user';
import { UserCreateDTO } from '../../../../shared/services/userMain.service';
import { ageValidator, passwordStrengthValidator, passwordValidator } from '../../../../shared/validators/confirmPasswordValidator';
import { MessageService } from 'primeng/api';
import { FluidModule } from 'primeng/fluid';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { PanelModule } from 'primeng/panel';
import { LogoComponent } from '../../../../pages/landing/components/logo/logo.component';

@Component({
    selector: 'app-inscription',
    imports: [FluidModule, ButtonModule, PanelModule, TextareaModule, InputTextModule, DatePickerModule, SelectModule, CommonModule, ReactiveFormsModule, MessageModule, RouterModule, LogoComponent],

    templateUrl: './inscription.component.html',
    styleUrl: './inscription.component.scss',
    providers: []
})
export class InscriptionComponent {
    authService = inject(UserMainService);
    messageService = inject(MessageService);
    fb = inject(FormBuilder);
    router = inject(Router);
    errorMessage = '';
    errorRegistration = false;
    isLoading = false;

    typesGenderList: GenderDropDown[] = [
        {
            id: '0',
            name: 'Homme',
            value: EnumGender.Homme
        },
        {
            id: '1',
            name: 'Femme',
            value: EnumGender.Femme
        },
        {
            id: '2',
            name: 'Non-binaire',
            value: EnumGender.NonBinaire
        },
        {
            id: '3',
            name: 'Autre',
            value: EnumGender.Autre
        }
    ];
    selectedGender: GenderDropDown = {
        id: '3',
        name: 'Autre',
        value: EnumGender.Autre
    };

    userForm = this.fb.group(
        {
            email: ['', [Validators.email, Validators.required]],
            password: ['', [Validators.required, Validators.minLength(8), passwordStrengthValidator()]],
            confirmPassword: ['', [Validators.required]],
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            phoneNumber: [''],
            dateOfBirth: [new Date('1986-04-21'), [Validators.required, ageValidator()]],
            gender: [this.selectedGender, [Validators.required]],
            title: [''],
            description: ['']
        },
        { validators: [passwordValidator('password', 'confirmPassword')] }
    );

    async submit() {
        this.isLoading = true;
        const newUser = {
            ...this.userForm.value,
            gender: this.userForm.value['gender']?.value,
            dateOfBirth: this.userForm.value['dateOfBirth']?.toISOString()
        } as UserCreateDTO;

        try {
            await firstValueFrom(
                (this.authService as any).register(newUser).pipe(
                    tap((res) => {
                        console.log('res', res);
                        this.router.navigate(['auth/account-created-successfully']);
                    }),
                    finalize(() => {
                        setTimeout(() => {
                            this.isLoading = false;
                        }, 200);
                    })
                )
            );
        } catch (err) {
            console.error(err);
            this.messageService.add({
                summary: 'Erreur',
                detail: (err as any).error.message,
                severity: 'error'
            });
            this.errorMessage = (err as any).error.message;
            this.errorRegistration = true;
        }
    }
}
