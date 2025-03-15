import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { AdressesListComponent } from '../../components/adresses-list/adresses-list.component';
import { FormationsListComponent } from '../../components/formations-list/formations-list.component';
import { PersonnalInfosComponent } from '../../components/personnal-infos/personnal-infos.component';

@Component({
    selector: 'app-profile',
    imports: [CommonModule, ButtonModule, DividerModule, AdressesListComponent, FormationsListComponent, PersonnalInfosComponent],

    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss'
})
export class ProfileComponent {
    authService = inject(AuthService);
    user = this.authService.userConnected;
}
