import { Component, input, signal } from '@angular/core';
import { FormationResponseDTO } from '../../../../shared/models/formation';

@Component({
    selector: 'app-formations-list',
    standalone: false,

    templateUrl: './formations-list.component.html',
    styleUrl: './formations-list.component.scss'
})
export class FormationsListComponent {
    visibleRight = signal<boolean>(false);
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

    formationToEdit: FormationResponseDTO = {
        id: '1',
        title: 'Master en informatique',
        company: 'Université de Paris',
        startAt: new Date(),
        endAt: new Date(),
        city: 'Bordeaux',
        country: 'France'
    };

    close() {
        this.visibleRight.set(false);
    }

    open() {
        this.visibleRight.set(true);
    }
}
