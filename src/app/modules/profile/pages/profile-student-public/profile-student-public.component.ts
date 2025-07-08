import { Component, inject, OnInit, Signal, signal } from '@angular/core';
import { UserMainService } from '../../../../shared/services/userMain.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { AdressesListComponent } from '../../components/adresses-list/adresses-list.component';
import { FormationsListComponent } from '../../components/formations-list/formations-list.component';
import { PersonnalInfosComponent } from '../../components/personnal-infos/personnal-infos.component';
import { FormationMainService } from '../../../../shared/services/formationMain.service';
import { AddressMainService } from '../../../../shared/services/addressMain.service';
import { UserResponseDTO } from '../../../../shared/services/userMain.service';
import { ActivatedRoute } from '@angular/router';
import { Address } from '../../../../api/models/Address';
import { FormationResponseDTO } from '../../../../api/models/FormationResponseDTO';

@Component({
    selector: 'app-profile-student-public',
    imports: [CommonModule, ButtonModule, DividerModule, AdressesListComponent, PersonnalInfosComponent, FormationsListComponent],

    templateUrl: './profile-student-public.component.html',
    styleUrl: './profile-student-public.component.scss'
})
export class ProfileStudentPublicComponent implements OnInit {
    authService = inject(UserMainService);
    activatedRoute = inject(ActivatedRoute);
    formationService = inject(FormationMainService);
    addressService = inject(AddressMainService);

    formations = signal<FormationResponseDTO[]>([]);
    addresses = signal<Address[]>([]);

    user = signal<UserResponseDTO>({} as UserResponseDTO);

    canEdit = false;

    ngOnInit(): void {
        this.activatedRoute.paramMap.subscribe((params) => {
            const userId = params.get('userId') ?? '';
            (this.authService as any).getPublicProfile(userId).subscribe((res: any) => {
                this.user.set(res.data as UserResponseDTO);
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
