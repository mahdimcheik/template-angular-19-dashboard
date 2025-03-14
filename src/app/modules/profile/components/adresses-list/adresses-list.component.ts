import { Component, inject, input, signal } from '@angular/core';
import { AdresseDTO } from '../../../../shared/models/adresse';
import { firstValueFrom } from 'rxjs';
import { AdresseService } from '../../../../shared/services/adresse.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AdressComponent } from '../address/address.component';
import { ModalAddOrEditAddressComponent } from '../modal-add-or-edit-address/modal-add-or-edit-address.component';

@Component({
    selector: 'app-adresses-list',
    imports: [CommonModule, ButtonModule, AdressComponent, ModalAddOrEditAddressComponent],
    templateUrl: './adresses-list.component.html',
    styleUrl: './adresses-list.component.scss'
})
export class AdressesListComponent {
    addressService = inject(AdresseService);
    userConnected = inject(AuthService).userConnected;
    addresses = this.addressService.listAddresses;

    ngOnInit() {
        this.addressService.getAllAddresses(this.userConnected().id).subscribe();
    }

    visibleRight = signal<boolean>(false);

    close() {
        this.visibleRight.set(false);
    }

    open() {
        this.visibleRight.set(true);
    }
}
