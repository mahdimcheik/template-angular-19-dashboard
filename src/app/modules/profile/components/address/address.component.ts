import { Component, inject, input, model, signal } from '@angular/core';
import { AdresseDTO } from '../../../../shared/models/adresse';
import { AdresseService } from '../../../../shared/services/adresse.service';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-address',
    standalone: false,

    templateUrl: './address.component.html',
    styleUrl: './address.component.scss'
})
export class AdressComponent {
    address = input.required<AdresseDTO>();
    visibleRight = signal<boolean>(false);
    visibleModalDelete = model<boolean>(false);
    addressService = inject(AdresseService);

    close() {
        this.visibleRight.set(false);
    }
    open() {
        this.visibleRight.set(true);
    }
    async deleteAddress() {
        await firstValueFrom(this.addressService.deleteAddresse(this.address().id));
        this.visibleModalDelete.set(false);
    }
}
