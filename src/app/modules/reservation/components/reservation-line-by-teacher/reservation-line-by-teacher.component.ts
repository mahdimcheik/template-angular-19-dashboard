import { Component, input } from '@angular/core';
import { BookingResponseDTO } from '../../../../api/models/BookingResponseDTO';
import { ButtonModule } from 'primeng/button';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
    selector: 'app-reservation-line-by-teacher',
    imports: [ButtonModule, DatePipe, CurrencyPipe],

    templateUrl: './reservation-line-by-teacher.component.html',
    styleUrl: './reservation-line-by-teacher.component.scss'
})
export class ReservationLineByTeacherComponent {
    reservation = input.required<BookingResponseDTO>();
}
