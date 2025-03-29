import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { AdressesListComponent } from '../../components/adresses-list/adresses-list.component';
import { FormationsListComponent } from '../../components/formations-list/formations-list.component';
import { PersonnalInfosComponent } from '../../components/personnal-infos/personnal-infos.component';
import { FormationService } from '../../../../shared/services/formation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormationResponseDTO } from '../../../../shared/models/formation';
import { AdresseService } from '../../../../shared/services/adresse.service';
import { AdresseDTO } from '../../../../shared/models/adresse';

@Component({
    selector: 'app-profile',
    imports: [CommonModule, ButtonModule, DividerModule, AdressesListComponent, PersonnalInfosComponent, FormationsListComponent],

    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
    route = inject(ActivatedRoute);
    authService = inject(AuthService);
    formationService = inject(FormationService);
    addressService = inject(AdresseService);
    formations: FormationResponseDTO[] = [];
    addresses: AdresseDTO[] = [];

    user = this.authService.userConnected;
    canEdit = false;

    ngOnInit(): void {
        this.route.paramMap.subscribe((params) => {
            const userId = params.get('userId') ?? '123';

            if (userId === 'me') {
                this.canEdit = true;
                this.formationService.getFormations(this.user().id).subscribe((res) => {
                    this.formations = res.data;
                });

                this.addressService.getAllAddresses(this.user().id).subscribe((res) => {
                    this.addresses = res.data;
                });
            } else {
                this.canEdit = false;
                this.formationService.getFormations(userId).subscribe((res) => {
                    this.formations = res.data;
                });

                this.addressService.getAllAddresses(userId).subscribe((res) => {
                    this.addresses = res.data;
                });
            }
        });
    }
}
