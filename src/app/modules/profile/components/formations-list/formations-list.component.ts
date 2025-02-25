import { Component, input } from '@angular/core';
import { FormationResponseDTO } from '../../../../shared/models/formation';

@Component({
    selector: 'app-formations-list',
    standalone: false,

    templateUrl: './formations-list.component.html',
    styleUrl: './formations-list.component.scss'
})
export class FormationsListComponent {
    formations = input<FormationResponseDTO[]>([
        {
            id: '1',
            title: 'Master en informatique',
            company: 'Université de Paris',
            startAt: new Date(),
            endAt: new Date(),
            city: 'Bordeaux',
            country: 'France'
        },
        {
            id: '2',
            title: 'Master en informatique',
            company: 'Université de Paris',
            startAt: new Date(),
            endAt: new Date(),
            city: 'Bordeaux',
            country: 'France'
        }
    ]);
}
