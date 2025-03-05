import { Component, input } from '@angular/core';
import { ReservationResponseDTO } from '../../../../shared/models/slot';

@Component({
    selector: 'app-reservation-line-by-teacher',
    standalone: false,

    templateUrl: './reservation-line-by-teacher.component.html',
    styleUrl: './reservation-line-by-teacher.component.scss'
})
export class ReservationLineByTeacherComponent {
    reservation = input.required<ReservationResponseDTO>();
}
