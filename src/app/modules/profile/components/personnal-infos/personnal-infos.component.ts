import { Component, computed, inject, input, Input, signal, WritableSignal } from '@angular/core';
import { UserResponseDTO } from '../../../../shared/models/user';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
    selector: 'app-personnal-infos',
    standalone: false,
    templateUrl: './personnal-infos.component.html',
    styleUrl: './personnal-infos.component.scss'
})
export class PersonnalInfosComponent {
    userToDisplay = input.required<UserResponseDTO>();
    isVisibleModalEditPerso = signal<boolean>(false);

    authService = inject(AuthService);

    fullName = computed(() => `${this.userToDisplay().firstName} ${this.userToDisplay().lastName}`);
    isOwner = computed(() => this.userToDisplay().id === this.authService.userConnected().id);

    open() {
        this.isVisibleModalEditPerso.set(true);
    }
}
