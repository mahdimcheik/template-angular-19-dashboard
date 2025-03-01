import { Component, inject, input, signal } from '@angular/core';
import { AdresseDTO } from '../../../../shared/models/adresse';
import { firstValueFrom } from 'rxjs';
import { AdresseService } from '../../../../shared/services/adresse.service';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
    selector: 'app-adresses-list',
    standalone: false,
    templateUrl: './adresses-list.component.html',
    styleUrl: './adresses-list.component.scss'
})
export class AdressesListComponent {
    addressService = inject(AdresseService);
    userConnected = inject(AuthService).userConnected;
    addresses = this.addressService.listAddresses;

    async ngOnInit() {
        await firstValueFrom(this.addressService.getAllAddresses(this.userConnected().id));
    }

    visibleRight = signal<boolean>(false);

    close() {
        this.visibleRight.set(false);
    }

    open() {
        this.visibleRight.set(true);
    }
}
