import { Component, inject, input, model, output } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { EnumGender, GenderDropDown, UserResponseDTO, UserUpdateDTO } from '../../../../shared/models/user';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../shared/services/auth.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { FluidModule } from 'primeng/fluid';
import { GenericMessageComponent } from '../../../../pages/uikit/generic-message/generic-message.component';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';
import { LayoutService } from '../../../../layout/service/layout.service';

@Component({
    selector: 'app-modal-edit-personnal-infos',
    imports: [CommonModule, ButtonModule, DrawerModule, MessageModule, TextareaModule, InputTextModule, SelectModule, FluidModule, GenericMessageComponent, FormsModule, ReactiveFormsModule, FileUploadModule],

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

    authService = inject(AuthService);
    layoutService = inject(LayoutService);

    fb = inject(FormBuilder);
    messageService = inject(MessageService);

    typesGenderList = [
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

    userForm!: FormGroup;

    ngOnInit(): void {
        this.selectedGender = this.typesGenderList.find((x) => x.value == this.user().gender) ?? this.typesGenderList[3];

        this.userForm = this.fb.group({
            firstName: [this.user().firstName, [Validators.required]],
            lastName: [this.user().lastName, [Validators.required]],
            dateOfBirth: [new Date(this.user().dateOfBirth), [Validators.required]],
            gender: [this.selectedGender],
            title: [this.user().title],
            description: [this.user().description]
        });
    }
    async submit() {
        const newUser = {
            ...this.user(),
            firstName: this.userForm.value['firstName'],
            lastName: this.userForm.value['lastName'],
            dateOfBirth: this.userForm.value['dateOfBirth'],
            gender: this.userForm.value['gender'].value,
            title: this.userForm.value['title'] ? this.userForm.value['title'] : this.user().title,
            description: this.userForm.value['description']
        };

        if (this.fileName && this.file != null) {
            await firstValueFrom(this.authService.updateAvatar(this.file));
        }

        await firstValueFrom(this.authService.updatePersonnalInfos(newUser as unknown as UserUpdateDTO));

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
