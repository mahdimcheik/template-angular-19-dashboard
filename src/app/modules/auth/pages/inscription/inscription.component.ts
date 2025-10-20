import { Component, inject, OnInit } from '@angular/core';
import { UserMainService } from '../../../../shared/services/userMain.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { CheckboxModule } from 'primeng/checkbox';
import { LogoComponent } from '../../../../pages/landing/components/logo/logo.component';
import { CookieConsentService } from '../../../../shared/services/cookie-consent.service';
import { Structure } from '../../../../generic-components/configurable-form/related-models';
import { ConfigurableFormComponent } from '../../../../generic-components/configurable-form/configurable-form.component';

@Component({
    selector: 'app-inscription',
    imports: [FluidModule, ButtonModule, PanelModule, TextareaModule, InputTextModule, DatePickerModule, SelectModule, CheckboxModule, CommonModule, ReactiveFormsModule, MessageModule, RouterModule, LogoComponent, ConfigurableFormComponent],

    templateUrl: './inscription.component.html',
    styleUrl: './inscription.component.scss',
    providers: []
})
export class InscriptionComponent {
    authService = inject(UserMainService);
    messageService = inject(MessageService);
    fb = inject(FormBuilder);
    router = inject(Router);
    cookieConsentService = inject(CookieConsentService);
    typesGenderList: GenderDropDown[] = this.authService.typesGenderList;
    selectedGender: GenderDropDown = this.typesGenderList[3];

    inscriptionFormStructure: Structure = {
        id: 'inscriptionForm',
        name: 'inscriptionForm',
        label: 'Inscription',
        globalValidators: [Validators.required],
        styleClass: 'max-w-[40rem] ',
        hideCancelButton: true,
        hideSubmitButton: true,
        formFieldGroups: [
            {
                id: 'inscriptionForm',
                name: 'inscriptionForm',
                label: 'Inscription',
                fields: [
                    {
                        id: 'firstName',
                        name: 'firstName',
                        type: 'text',
                        label: 'Prénom',
                        required: true,
                        placeholder: 'Prénom',
                        validation: [Validators.required]
                    },
                    {
                        id: 'lastName',
                        name: 'lastName',
                        type: 'text',
                        label: 'Nom',
                        required: true,
                        placeholder: 'Nom',
                        validation: [Validators.required]
                    },
                    {
                        id: 'email',
                        name: 'email',
                        type: 'email',
                        label: 'Email',
                        required: true,
                        placeholder: 'Email',
                        fullWidth: true,

                        validation: [Validators.email, Validators.required]
                    },
                    {
                        id: 'password',
                        name: 'password',
                        type: 'password',
                        label: 'Mot de passe',
                        required: true,
                        placeholder: 'Mot de passe',
                        validation: [Validators.required, Validators.minLength(8), passwordStrengthValidator()]
                    },
                    {
                        id: 'confirmPassword',
                        name: 'confirmPassword',
                        type: 'password',
                        label: 'Confirmer le mot de passe',
                        placeholder: 'Confirmer le mot de passe',
                        validation: [Validators.required]
                    },
                    {
                        id: 'dateOfBirth',
                        name: 'dateOfBirth',
                        type: 'date',
                        label: 'Date de naissance',
                        required: true,
                        placeholder: 'Date de naissance',
                        validation: [Validators.required, ageValidator()]
                    },
                    {
                        id: 'gender',
                        name: 'gender',
                        label: 'Genre',
                        type: 'select',
                        placeholder: 'Genre',
                        required: true,
                        options: this.typesGenderList,
                        displayKey: 'name'
                    }
                ],
                groupValidators: [passwordValidator('password', 'confirmPassword')]
            },
            {
                id: 'optionalFields',
                name: 'optionalFields',
                label: 'Champs facultatifs',
                fields: [
                    {
                        id: 'phoneNumber',
                        name: 'phoneNumber',
                        type: 'text',
                        label: 'Numéro de téléphone',
                        required: false,
                        placeholder: 'Numéro de téléphone'
                    },
                    {
                        id: 'title',
                        name: 'title',
                        type: 'text',
                        label: 'Titre',
                        required: false,
                        placeholder: 'Titre'
                    },
                    {
                        id: 'description',
                        name: 'description',
                        type: 'textarea',
                        label: 'Description',
                        required: false,
                        placeholder: 'Description'
                    }
                ]
            },
            {
                id: 'privacy',
                name: 'privacy',
                label: 'Consentements et confidentialité',
                fields: [
                    {
                        id: 'privacyPolicyConsent',
                        name: 'privacyPolicyConsent',
                        type: 'checkbox',
                        label: "J'ai lu et j'accepte la politique de confidentialité",
                        required: true,
                        fullWidth: true,
                        validation: [Validators.requiredTrue]
                    },
                    {
                        id: 'dataProcessingConsent',
                        name: 'dataProcessingConsent',
                        type: 'checkbox',

                        label: "J'accepte que mes données personnelles soient traitées conformément au RGPD pour la création et la gestion de mon compte, ainsi que pour la fourniture des services de la plateforme.",
                        required: true,
                        fullWidth: true,
                        validation: [Validators.requiredTrue]
                    }
                ]
            }
        ]
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
            description: [''],
            privacyPolicyConsent: [false, [Validators.requiredTrue]],
            dataProcessingConsent: [false, [Validators.requiredTrue]]
        },
        { validators: [passwordValidator('password', 'confirmPassword')] }
    );

    async submit(e: FormGroup) {
        const formValue = e.value;

        const newUser: UserCreateDTO = {
            email: formValue.inscriptionForm.email,
            password: formValue.inscriptionForm.password,
            firstName: formValue.inscriptionForm.firstName,
            lastName: formValue.inscriptionForm.lastName,
            gender: formValue.inscriptionForm.gender.value,
            dateOfBirth: formValue.inscriptionForm.dateOfBirth.toISOString(),
            phoneNumber: formValue.optionalFields.phoneNumber,
            title: formValue.optionalFields.title,
            description: formValue.optionalFields.description,
            privacyPolicyConsent: formValue.privacy.privacyPolicyConsent,
            dataProcessingConsent: formValue.privacy.dataProcessingConsent
        };

        try {
            await firstValueFrom(
                this.authService.register(newUser).pipe(
                    tap((res) => {
                        this.router.navigate(['auth/account-created-successfully']);
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
