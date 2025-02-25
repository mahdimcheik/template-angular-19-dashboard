import { Component, input } from '@angular/core';
import { AdresseDTO } from '../../../../shared/models/adresse';

@Component({
    selector: 'app-adresses-list',
    standalone: false,
    templateUrl: './adresses-list.component.html',
    styleUrl: './adresses-list.component.scss'
})
export class AdressesListComponent {
    adresses = input<AdresseDTO[]>([
        {
            id: '1',
            street: 'Rue de la paix',
            city: 'Paris',
            postalCode: '75000',
            country: 'France',
            streetNumber: 1,
            streetLine2: 'Bâtiment A',
            state: 'Ile-de-France',
            addressType: 0
        },
        {
            id: '2',
            street: 'Rue de la paix',
            city: 'Paris',
            postalCode: '75000',
            country: 'France',
            streetNumber: 1,
            streetLine2: 'Bâtiment A',
            state: 'Ile-de-France',
            addressType: 0
        }
    ]);
}
