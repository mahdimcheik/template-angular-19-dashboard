import { CommonModule } from '@angular/common';
import { Component, computed, input, model } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { UserResponseDTO } from '../../../../shared/models/user';
import { AvatarModule } from 'primeng/avatar';
import { DobToAgePipe } from '../../../../shared/pipes/dob-to-age.pipe';

@Component({
    selector: 'app-modal-edit-user-by-admin',
    imports: [InputTextModule, AvatarModule, DobToAgePipe, TextareaModule, MessageModule, ButtonModule, FluidModule, SelectModule, CommonModule, ReactiveFormsModule, DialogModule],

    templateUrl: './modal-edit-user-by-admin.component.html',
    styleUrl: './modal-edit-user-by-admin.component.scss'
})
export class ModalEditUserByAdminComponent {
    visible = model<boolean>(false);
    user = input.required<UserResponseDTO>();
    isBanned = computed(() => (this.user()?.isBanned ? `est banni(e) jusqu\'au` : ''));
}
