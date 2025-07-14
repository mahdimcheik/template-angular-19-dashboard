import { Component, inject, input, model, output } from '@angular/core';
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

    typesGenderList: GenderDropDown[] = this.authService.typesGenderList;

    personnalInfosFormStructure: Structure = {
        id: 'personnalInfos',
        name: 'personnalInfos',
        label: 'Informations personnelles',
        description: 'Informations personnelles',
        formFieldGroups: [
            {
                id: 'personnalInfos',
                name: 'personnalInfos',
                label: 'Informations personnelles',
                description: 'Informations personnelles',
                fields: [
                    {
                        id: 'firstName',
                        name: 'firstName',
                        label: 'Prénom',
                        type: 'text',
                        placeholder: 'Prénom',
                        required: true,
                        order: 1
                    },
                    {
                        id: 'lastName',
                        name: 'lastName',
                        label: 'Nom',
                        type: 'text',
                        placeholder: 'Nom',
                        required: true
                    },
                    {
                        id: 'dateOfBirth',
                        name: 'dateOfBirth',
                        label: 'Date de naissance',
                        type: 'date',
                        placeholder: 'Date de naissance',
                        required: true,
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
                        required: true,
                        order: 5
                    },
                    {
                        id: 'description',
                        name: 'description',
                        label: 'Description',
                        type: 'textarea',
                        placeholder: 'Description',
                        required: true,
                        order: 6
                    }
                ]
            },
            {
                id: 'socialMedia',
                name: 'socialMedia',
                label: 'Réseaux sociaux',
                description: 'Réseaux sociaux',
                fields: [
                    {
                        id: 'linkedinUrl',
                        name: 'linkedinUrl',
                        label: 'LinkedIn',
                        type: 'text',
                        placeholder: 'LinkedIn',
                        required: true,
                        order: 1
                    },
                    {
                        id: 'githubUrl',
                        name: 'githubUrl',
                        label: 'GitHub',
                        type: 'text',
                        placeholder: 'GitHub',
                        required: true,
                        order: 2
                    }
                ]
            }
        ]
    };

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
    }
    async submit() {
        const newUser = {
            id: this.user().id!,
            firstName: this.userForm.value['firstName'],
            lastName: this.userForm.value['lastName'],
            dateOfBirth: this.userForm.value['dateOfBirth']?.toISOString(),
            gender: this.userForm.value['gender'].value,
            title: this.userForm.value['title'] ? this.userForm.value['title'] : this.user().title,
            description: this.userForm.value['description'],
            linkedinUrl: this.userForm.value['linkedinUrl'],
            githubUrl: this.userForm.value['githubUrl'],
            phoneNumber: (this.user() as any).phoneNumber
        };

        if (this.fileName && this.file != null) {
            await firstValueFrom((this.authService as any).updateAvatar(this.file));
        }

        await firstValueFrom((this.authService as any).updatePersonnalInfos(newUser as UserUpdateDTO));

        this.onValidate.emit();
        this.visible.set(false);
    }
    cancel() {
        this.visible.set(false);
        this.onValidate.emit();
    }
    genderChosen() {}

    receiveFile(event: { file: File; fileName: string }) {
        this.file = event.file;
        this.fileName = event.fileName;
    }

    onUpload(event: any) {
        for (const file of event.files) {
            this.uploadedFiles.push(file);
        }
        this.receiveFile({ file: event.files[0], fileName: event.files[0].name });

        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Image téléversée' });
    }

    onBasicUpload() {
        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Image téléversée' });
    }
}
