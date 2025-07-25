import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { FormationResponseDTO } from '../../../../api/models/FormationResponseDTO';
import { FormationMainService } from '../../../../shared/services/formationMain.service';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ModalConfirmDeleteComponent } from '../modal-confirm-delete/modal-confirm-delete.component';
import { ModalEditOrAddFormationComponent } from '../modal-edit-or-add-formation/modal-edit-or-add-formation.component';

@Component({
    selector: 'app-formation',
    imports: [CommonModule, ButtonModule, ModalConfirmDeleteComponent, ModalEditOrAddFormationComponent],

    templateUrl: './formation.component.html',
    styleUrl: './formation.component.scss'
})
export class FormationComponent {
    formation = input.required<FormationResponseDTO>();
    visibleRight = signal<boolean>(false);
    visibleModalDelete = signal<boolean>(false);
    formationService = inject(FormationMainService);
    canEdit = input<boolean>(true);

    close() {
        this.visibleRight.set(false);
    }

    open() {
        this.visibleRight.set(true);
    }
    async deleteFormation() {
        if (this.formation().id) {
            await firstValueFrom(this.formationService.deleteFormation(this.formation().id!));
        }
    }
}
