import { Component, inject } from '@angular/core';
import { UserMainService } from '../../../../shared/services/userMain.service';

@Component({
    selector: 'app-mentions-legales',
    imports: [],
    templateUrl: './mentions-legales.component.html',
    styleUrl: './mentions-legales.component.scss'
})
export class MentionsLegalesComponent {
    owner = inject(UserMainService).teacherDetails;

    getCurrentDate(): string {
        return new Date().toLocaleDateString('fr-FR');
    }
}
