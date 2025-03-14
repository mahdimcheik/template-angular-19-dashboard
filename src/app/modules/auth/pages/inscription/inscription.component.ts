import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../../shared/services/auth.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { catchError, firstValueFrom, tap } from 'rxjs';
import { EnumGender, GenderDropDown, UserCreateDTO, UserLoginDTO } from '../../../../shared/models/user';
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

@Component({
    selector: 'app-inscription',
    imports: [FluidModule, ButtonModule, TextareaModule, InputTextModule, DatePickerModule, SelectModule, CommonModule, ReactiveFormsModule, MessageModule, RouterModule],

    templateUrl: './inscription.component.html',
    styleUrl: './inscription.component.scss',
    providers: []
})
export class InscriptionComponent {
    authService = inject(AuthService);
    messageService = inject(MessageService);
    fb = inject(FormBuilder);
    router = inject(Router);
    errorMessage = '';

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
        const newUser = {
            ...this.userForm.value,
            gender: this.userForm.value['gender']?.value
        } as UserCreateDTO;
        console.log('new user ', newUser);

        try {
            await firstValueFrom(
                this.authService.register(newUser).pipe(
                    tap((res) => {
                        console.log('res', res);
                        this.router.navigateByUrl('auth/account-created-successfully');
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
        }
    }
}
