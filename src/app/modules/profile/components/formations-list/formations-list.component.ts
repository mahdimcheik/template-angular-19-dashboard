import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormationResponseDTO } from '../../../../shared/models/formation';
import { firstValueFrom } from 'rxjs';
import { AdresseService } from '../../../../shared/services/adresse.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { FormationService } from '../../../../shared/services/formation.service';

@Component({
    selector: 'app-formations-list',
    standalone: false,

    templateUrl: './formations-list.component.html',
    styleUrl: './formations-list.component.scss'
})
export class FormationsListComponent implements OnInit {
    visibleRight = signal<boolean>(false);
    formationService = inject(FormationService);
    userConnected = inject(AuthService).userConnected;

    formations = this.formationService.listFormations;

    formationToEdit: FormationResponseDTO = {
        id: '1',
        title: 'Master en informatique',
        company: 'Université de Paris',
        startAt: new Date(),
        endAt: new Date(),
        city: 'Bordeaux',
        country: 'France'
    };

    async ngOnInit() {
        await firstValueFrom(this.formationService.getFormations(this.userConnected().id));
    }

    close() {
        this.visibleRight.set(false);
    }

    open() {
        this.visibleRight.set(true);
    }
}
