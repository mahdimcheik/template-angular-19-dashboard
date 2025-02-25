import { Component, input } from '@angular/core';
import { AdresseDTO } from '../../../../shared/models/adresse';

@Component({
    selector: 'app-adress',
    standalone: false,

    templateUrl: './adress.component.html',
    styleUrl: './adress.component.scss'
})
export class AdressComponent {
    adress = input.required<AdresseDTO>();
}
