import { Component, computed, inject, input, Input, output, signal, WritableSignal } from '@angular/core';
import { UserResponseDTO } from '../../../../shared/models/user';
import { AuthService } from '../../../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ImageModule } from 'primeng/image';
import { DobToAgePipe } from '../../../../shared/pipes/dob-to-age.pipe';
import { ModalEditPersonnalInfosComponent } from '../modal-edit-personnal-infos/modal-edit-personnal-infos.component';

@Component({
    selector: 'app-personnal-infos',
    imports: [CommonModule, ButtonModule, MessageModule, ImageModule, DobToAgePipe, ModalEditPersonnalInfosComponent],

    templateUrl: './personnal-infos.component.html',
    styleUrl: './personnal-infos.component.scss'
})
export class PersonnalInfosComponent {
    userToDisplay = input.required<UserResponseDTO>();
    canEdit = input<boolean>(true);
    isVisibleModalEditPerso = signal<boolean>(false);
    onValidate = output<void>();

    authService = inject(AuthService);

    fullName = computed(() => `${this.userToDisplay().firstName} ${this.userToDisplay().lastName}`);

    open() {
        this.isVisibleModalEditPerso.set(true);
    }
    reloadProfile() {
        this.onValidate.emit();
    }
}
