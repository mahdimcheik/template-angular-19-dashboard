import { Component } from '@angular/core';
import { ReservationListByTeacherComponent } from '../../components/reservation-list-by-teacher/reservation-list-by-teacher.component';

@Component({
    selector: 'app-reservations-teacher',
    imports: [ReservationListByTeacherComponent],

    templateUrl: './reservations-teacher.component.html',
    styleUrl: './reservations-teacher.component.scss'
})
export class ReservationsTeacherComponent {}
