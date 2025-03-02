import { Component, inject, OnInit } from '@angular/core';
import { SlotService } from '../../../../shared/services/slot.service';
import { QueryPanigation, ReservationResponseDTO } from '../../../../shared/models/slot';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-reservation-list-by-teacher',
    standalone: false,

    templateUrl: './reservation-list-by-teacher.component.html',
    styleUrl: './reservation-list-by-teacher.component.scss'
})
export class ReservationListByTeacherComponent implements OnInit {
    slotService = inject(SlotService);
    reservations = this.slotService.reservations;
    selectedReservation!: ReservationResponseDTO;

    async ngOnInit() {
        const query: QueryPanigation = {
            start: 0,
            perPage: 10
        };
        await firstValueFrom(this.slotService.getReservationsByStudent(query));
        await firstValueFrom(this.slotService.getReservationsByTeacher(query));
    }
}
