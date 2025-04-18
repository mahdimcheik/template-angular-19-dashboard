import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { AdressesListComponent } from '../../components/adresses-list/adresses-list.component';
import { FormationsListComponent } from '../../components/formations-list/formations-list.component';
import { PersonnalInfosComponent } from '../../components/personnal-infos/personnal-infos.component';
import { FormationService } from '../../../../shared/services/formation.service';
import { FormationResponseDTO } from '../../../../shared/models/formation';
import { AdresseService } from '../../../../shared/services/adresse.service';
import { AdresseDTO } from '../../../../shared/models/adresse';
import { UserResponseDTO } from '../../../../shared/models/user';

@Component({
    selector: 'app-profile',
    imports: [CommonModule, ButtonModule, DividerModule, AdressesListComponent, PersonnalInfosComponent, FormationsListComponent],

    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
    authService = inject(AuthService);
    formationService = inject(FormationService);
    addressService = inject(AdresseService);

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
