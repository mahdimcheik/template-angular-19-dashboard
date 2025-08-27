import { Component, computed, inject, input, model, output } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { EnumGender, GenderDropDown } from '../../../../shared/models/user';
import { UserResponseDTO, UserUpdateDTO } from '../../../../shared/services/userMain.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserMainService } from '../../../../shared/services/userMain.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { FluidModule } from 'primeng/fluid';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';
import { LayoutService } from '../../../../layout/service/layout.service';
import { Structure } from '../../../../generic-components/configurable-form/related-models';
import { ConfigurableFormComponent } from '../../../../generic-components/configurable-form/configurable-form.component';

@Component({
    selector: 'app-modal-edit-personnal-infos',
    imports: [CommonModule, ButtonModule, DrawerModule, MessageModule, TextareaModule, InputTextModule, SelectModule, FluidModule, FormsModule, ReactiveFormsModule, FileUploadModule, ConfigurableFormComponent],

    templateUrl: './modal-edit-personnal-infos.component.html',
    styleUrl: './modal-edit-personnal-infos.component.scss'
})
export class ModalEditPersonnalInfosComponent {
    user = input.required<UserResponseDTO>();
    onValidate = output<void>();
    visible = model<boolean>(false);
    title = input<string>('');
    selectedGender!: GenderDropDown;
    uploadedFiles: any[] = [];

    file?: File;
    fileName?: string;

    authService = inject(UserMainService);
    layoutService = inject(LayoutService);

    fb = inject(FormBuilder);
    messageService = inject(MessageService);

    imgUrl = computed(() => (!this.layoutService.isDarkTheme() ? 'assets/skillHiveSecondaryBlack.svg' : 'assets/skillHiveSecondaryWhite.svg'));
    typesGenderList: GenderDropDown[] = this.authService.typesGenderList;

    personnalInfosFormStructure!: Structure;

    userForm!: FormGroup;

    ngOnInit(): void {
        this.selectedGender = this.typesGenderList.find((x) => x.value == this.user().gender) ?? this.typesGenderList[3];

        this.userForm = this.fb.group({
            firstName: [this.user().firstName, [Validators.required]],
            lastName: [this.user().lastName, [Validators.required]],
            dateOfBirth: [new Date(this.user().dateOfBirth ?? ''), [Validators.required]],
            gender: [this.selectedGender],
            title: [this.user().title],
            description: [this.user().description],
            linkedinUrl: [this.user().linkedinUrl, Validators.pattern('^https?://(www\\.)?linkedin\\.com/in/[^/]+$')],
            githubUrl: [this.user().githubUrl, Validators.pattern('^https?://(www\\.)?github\\.com/[^/]+$')]
        });

        this.personnalInfosFormStructure = {
            id: 'personnalInfos',
            name: 'personnalInfos',
            label: 'Informations personnelles',
            description: 'Veuillez remplir les champs obligatoires',
            imgUrl: this.imgUrl(),

            formFieldGroups: [
                {
                    id: 'personnalInfos',
                    name: 'personnalInfos',
                    label: 'Informations personnelles',
                    description: 'Veuillez remplir les champs obligatoires',
                    fields: [
                        {
                            id: 'firstName',
                            name: 'firstName',
                            label: 'Prénom',
                            type: 'text',
                            placeholder: 'Prénom',
                            required: true,
                            value: this.user().firstName,
                            validation: [Validators.required, Validators.minLength(3), Validators.maxLength(20)],
                            order: 1
                        },
                        {
                            id: 'lastName',
                            name: 'lastName',
                            label: 'Nom',
                            type: 'text',
                            placeholder: 'Nom',
                            required: true,
                            value: this.user().lastName,
                            order: 2
                        },
                        {
                            id: 'dateOfBirth',
                            name: 'dateOfBirth',
                            label: 'Date de naissance',
                            type: 'date',
                            placeholder: 'Date de naissance',
                            required: true,
                            value: new Date(this.user().dateOfBirth ?? ''),
                            order: 3
                        },
                        {
                            id: 'gender',
                            name: 'gender',
                            label: 'Genre',
                            type: 'select',
                            placeholder: 'Genre',
                            required: true,
                            order: 4,
                            options: this.typesGenderList,
                            displayKey: 'name',
                            value: this.selectedGender
                        },
                        {
                            id: 'title',
                            name: 'title',
                            label: 'Titre',
                            type: 'text',
                            placeholder: 'Titre',
                            order: 5,
                            value: this.user().title,
                            fullWidth: true
                        },
                        {
                            id: 'description',
                            name: 'description',
                            label: 'Description',
                            type: 'textarea',
                            placeholder: 'Description',
                            value: this.user().description,
                            order: 6
                        },
                        {
                            id: 'phoneNumber',
                            name: 'phoneNumber',
                            label: 'Numéro de téléphone',
                            type: 'text',
                            placeholder: 'Numéro de téléphone',
                            value: this.user().phoneNumber ?? '',
                            order: 7,
                            fullWidth: true
                        }
                    ]
                },
                {
                    id: 'avatar',
                    name: 'avatar',
                    label: 'Avatar',
                    description: 'Veuillez remplir votre avatar',
                    fields: [
                        {
                            id: 'profilePicture',
                            name: 'profilePicture',
                            label: 'Image de profil',
                            type: 'file',
                            placeholder: 'Choisir votre image de profil',
                            accept: 'image/*',
                            maxFileSize: 1000000,
                            multiple: false,
                            mode: 'advanced',
                            chooseLabel: 'Choose Image',
                            uploadLabel: 'Téléverser',
                            cancelLabel: 'Annuler',
                            emptyMessage: 'Glissez et déposez votre image ici',
                            order: 1,
                            fullWidth: true
                        }
                    ]
                },
                {
                    id: 'socialMedia',
                    name: 'socialMedia',
                    label: 'Réseaux sociaux',
                    description: 'Veuillez remplir vos réseaux sociaux',
                    fields: [
                        {
                            id: 'linkedinUrl',
                            name: 'linkedinUrl',
                            label: 'LinkedIn',
                            type: 'text',
                            placeholder: 'LinkedIn',
                            order: 1,
                            value: this.user().linkedinUrl,
                            fullWidth: true,
                            validation: [Validators.pattern('^https?://(www\\.)?linkedin\\.com/in/[^/]+$')]
                        },
                        {
                            id: 'githubUrl',
                            name: 'githubUrl',
                            label: 'GitHub',
                            type: 'text',
                            placeholder: 'GitHub',
                            order: 2,
                            value: this.user().githubUrl,
                            fullWidth: true,
                            validation: [Validators.pattern('^https?://(www\\.)?github\\.com/[^/]+$')]
                        }
                    ]
                }
            ]
        };
    }
    async submit(event: FormGroup<any>) {
        const data = event.value;
        const newUser = {
            id: this.user().id!,
            firstName: data.personnalInfos['firstName'],
            lastName: data.personnalInfos['lastName'],
            dateOfBirth: data.personnalInfos['dateOfBirth']?.toISOString(),
            gender: +data.personnalInfos['gender'].value,
            phoneNumber: data.personnalInfos['phoneNumber'],
            title: data.personnalInfos['title'],
            description: data.personnalInfos['description'],
            linkedinUrl: data.socialMedia['linkedinUrl'],
            githubUrl: data.socialMedia['githubUrl']
        };

        if (data.avatar['profilePicture']) {
            await firstValueFrom((this.authService as any).updateAvatar(data.avatar['profilePicture']));
        }

        await firstValueFrom((this.authService as any).updatePersonnalInfos(newUser as UserUpdateDTO));

        this.onValidate.emit();
        this.visible.set(false);
    }
    cancel() {
        this.visible.set(false);
        this.onValidate.emit();
    }
}
