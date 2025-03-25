import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormationResponseDTO } from '../../../../shared/models/formation';
import { firstValueFrom } from 'rxjs';
import { AdresseService } from '../../../../shared/services/adresse.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { FormationService } from '../../../../shared/services/formation.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormationComponent } from '../formation/formation.component';
import { ModalEditOrAddFormationComponent } from '../modal-edit-or-add-formation/modal-edit-or-add-formation.component';

@Component({
    selector: 'app-formations-list',
    imports: [CommonModule, ButtonModule, FormationComponent, ModalEditOrAddFormationComponent],
    templateUrl: './formations-list.component.html',
    styleUrl: './formations-list.component.scss'
})
export class FormationsListComponent {
    visibleRight = signal<boolean>(false);
    formationService = inject(FormationService);

    formations = input.required<FormationResponseDTO[]>();
    canEdit = input<boolean>(true);

    close() {
        this.visibleRight.set(false);
    }

    open() {
        this.visibleRight.set(true);
    }
}
