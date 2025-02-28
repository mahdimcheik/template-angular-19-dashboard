import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { FormationResponseDTO } from '../../../../shared/models/formation';
import { FormationService } from '../../../../shared/services/formation.service';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-formation',
    standalone: false,

    templateUrl: './formation.component.html',
    styleUrl: './formation.component.scss'
})
export class FormationComponent {
    formation = input.required<FormationResponseDTO>();
    visibleRight = signal<boolean>(false);
    visibleModalDelete = signal<boolean>(false);
    formationService = inject(FormationService);
    close() {
        this.visibleRight.set(false);
    }

    open() {
        this.visibleRight.set(true);
    }
    async deleteFormation() {
        await firstValueFrom(this.formationService.deleteFormation(this.formation().id));
    }
}
