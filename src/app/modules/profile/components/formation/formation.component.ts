import { Component, input, OnInit, signal } from '@angular/core';
import { FormationResponseDTO } from '../../../../shared/models/formation';

@Component({
    selector: 'app-formation',
    standalone: false,

    templateUrl: './formation.component.html',
    styleUrl: './formation.component.scss'
})
export class FormationComponent {
    formation = input.required<FormationResponseDTO>();
}
