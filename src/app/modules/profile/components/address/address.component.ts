import { Component, inject, input, model, signal } from '@angular/core';
import { AddressMainService } from '../../../../shared/services/addressMain.service';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AdresseImagePipe } from '../../../../shared/pipes/adresse-type.pipe';
import { ModalAddOrEditAddressComponent } from '../modal-add-or-edit-address/modal-add-or-edit-address.component';
import { ModalConfirmDeleteComponent } from '../modal-confirm-delete/modal-confirm-delete.component';
import { Address } from '../../../../api/models/Address';

@Component({
    selector: 'app-address',
    imports: [CommonModule, ButtonModule, AdresseImagePipe, ModalAddOrEditAddressComponent, ModalConfirmDeleteComponent],
    templateUrl: './address.component.html',
    styleUrl: './address.component.scss'
})
export class AdressComponent {
    address = input.required<Address>();
    visibleRight = signal<boolean>(false);
    visibleModalDelete = model<boolean>(false);
    addressService = inject(AddressMainService);
    canEdit = input<boolean>(true);

    close() {
        this.visibleRight.set(false);
    }
    open() {
        this.visibleRight.set(true);
    }
    async deleteAddress() {
        if (this.address().id) {
            await firstValueFrom(this.addressService.deleteAddresse(this.address().id ?? ''));
        }
        this.visibleModalDelete.set(false);
    }
}
