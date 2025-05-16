import { Component } from '@angular/core';
import { ReservationListComponent } from '../../components/reservation-list-by-teacher/reservation-list-by-teacher.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-reservations',
    imports: [ReservationListComponent, CommonModule],

    templateUrl: './reservations-teacher.component.html',
    styleUrl: './reservations-teacher.component.scss'
})
export class ReservationsPageComponent {}
