import { Component, computed, inject, input, Input, output, signal, WritableSignal } from '@angular/core';
// import { UserResponseDTO } from '../../../../shared/models/user';
import { UserMainService, UserResponseDTO } from '../../../../shared/services/userMain.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ImageModule } from 'primeng/image';
import { DobToAgePipe } from '../../../../shared/pipes/dob-to-age.pipe';
import { ModalEditPersonnalInfosComponent } from '../modal-edit-personnal-infos/modal-edit-personnal-infos.component';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-personnal-infos',
    imports: [CommonModule, ButtonModule, MessageModule, ImageModule, DobToAgePipe, ModalEditPersonnalInfosComponent, TooltipModule],

    templateUrl: './personnal-infos.component.html',
    styleUrl: './personnal-infos.component.scss'
})
export class PersonnalInfosComponent {
    userToDisplay = input.required<UserResponseDTO>();
    canEdit = input<boolean>(true);
    isVisibleModalEditPerso = signal<boolean>(false);
    onValidate = output<void>();

    authService = inject(UserMainService);

    fullName = computed(() => `${this.userToDisplay().email ? this.userToDisplay()?.firstName + ' ' + this.userToDisplay()?.lastName : ''}`);

    open() {
        this.isVisibleModalEditPerso.set(true);
    }
    resendConfirmationLink() {
        (this.authService as any).resendConfirmationLink().subscribe();
    }
}
