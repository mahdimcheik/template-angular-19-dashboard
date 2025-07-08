import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { AdressesListComponent } from '../../components/adresses-list/adresses-list.component';
import { FormationsListComponent } from '../../components/formations-list/formations-list.component';
import { PersonnalInfosComponent } from '../../components/personnal-infos/personnal-infos.component';
import { FormationMainService } from '../../../../shared/services/formationMain.service';
import { AddressMainService } from '../../../../shared/services/addressMain.service';
import { UserResponseDTO } from '../../../../shared/models/user';
import { CursusListComponent } from '../../../cursus/components/cursus-list/cursus-list.component';

@Component({
    selector: 'app-profile',
    imports: [CommonModule, ButtonModule, DividerModule, AdressesListComponent, PersonnalInfosComponent, FormationsListComponent, CursusListComponent],

    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
    authService = inject(AuthService);
    formationService = inject(FormationMainService);
    addressService = inject(AddressMainService);

    formations = this.formationService.formations;
    addresses = this.addressService.addresses;

    user = signal<UserResponseDTO>({} as UserResponseDTO);

    canEdit = false;

    ngOnInit(): void {
        this.canEdit = true;
        this.user = this.authService.userConnected;

        this.formationService.getFormations(this.user().id).subscribe();
        this.addressService.getAllAddresses(this.user().id).subscribe();
    }
}
