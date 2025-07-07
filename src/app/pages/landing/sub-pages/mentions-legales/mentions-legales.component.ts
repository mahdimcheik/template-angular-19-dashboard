import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
    selector: 'app-mentions-legales',
    imports: [],
    templateUrl: './mentions-legales.component.html',
    styleUrl: './mentions-legales.component.scss'
})
export class MentionsLegalesComponent {
    owner = inject(AuthService).teacherDetails;
}
