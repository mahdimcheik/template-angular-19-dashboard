import { Component, inject, OnInit, Signal, signal } from '@angular/core';
import { AuthService } from '../../../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { AdressesListComponent } from '../../components/adresses-list/adresses-list.component';
import { FormationsListComponent } from '../../components/formations-list/formations-list.component';
import { PersonnalInfosComponent } from '../../components/personnal-infos/personnal-infos.component';
import { FormationService } from '../../../../shared/services/formation.service';
import { AddressMainService } from '../../../../shared/services/addressMain.service';
import { UserResponseDTO } from '../../../../shared/models/user';
import { ActivatedRoute } from '@angular/router';
import { FormationResponseDTO } from '../../../../shared/models/formation';
import { Address } from '../../../../api/models/Address';

@Component({
    selector: 'app-profile-student-public',
    imports: [CommonModule, ButtonModule, DividerModule, AdressesListComponent, PersonnalInfosComponent, FormationsListComponent],

    templateUrl: './profile-student-public.component.html',
    styleUrl: './profile-student-public.component.scss'
})
export class ProfileStudentPublicComponent implements OnInit {
    authService = inject(AuthService);
    activatedRoute = inject(ActivatedRoute);
    formationService = inject(FormationService);
    addressService = inject(AddressMainService);

    formations = signal<FormationResponseDTO[]>([]);
    addresses = signal<Address[]>([]);

    user!: UserResponseDTO;

    canEdit = false;

    ngOnInit(): void {
        this.activatedRoute.paramMap.subscribe((params) => {
            const userId = params.get('userId') ?? '';
            this.authService.getPublicProfile(userId).subscribe((res) => {
                this.user = res.data as UserResponseDTO;
                this.formationService.getFormations(userId, false).subscribe((res) => {
                    this.formations.set(res.data);
                });
                this.addressService.getAllAddresses(userId, false).subscribe((res) => {
                    this.addresses.set(res.data as any[]);
                });
            });
        });
    }
}
