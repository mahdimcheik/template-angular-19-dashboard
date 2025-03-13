import { Component, inject, input, model, signal } from '@angular/core';
import { AdresseDTO } from '../../../../shared/models/adresse';
import { AdresseService } from '../../../../shared/services/adresse.service';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AdresseImagePipe } from '../../../../shared/pipes/adresse-type.pipe';
import { ModalAddOrEditAddressComponent } from '../modal-add-or-edit-address/modal-add-or-edit-address.component';
import { ModalConfirmDeleteComponent } from '../modal-confirm-delete/modal-confirm-delete.component';

@Component({
    selector: 'app-address',
    imports: [CommonModule, ButtonModule, AdresseImagePipe, ModalAddOrEditAddressComponent, ModalConfirmDeleteComponent],
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
