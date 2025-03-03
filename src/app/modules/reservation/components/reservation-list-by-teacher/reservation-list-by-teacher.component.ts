import { ChangeDetectionStrategy, Component, inject, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { SlotService } from '../../../../shared/services/slot.service';
import { QueryPanigation, ReservationResponseDTO } from '../../../../shared/models/slot';
import { delay, firstValueFrom } from 'rxjs';
import { SortEvent } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
    selector: 'app-reservation-list-by-teacher',
    standalone: false,

    templateUrl: './reservation-list-by-teacher.component.html',
    styleUrl: './reservation-list-by-teacher.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReservationListByTeacherComponent implements OnInit {
    @ViewChild('dt') dt!: Table;
    @ViewChild('pname') pname!: any;
    slotService = inject(SlotService);
    reservations = this.slotService.reservations;
    private cdr = inject(ChangeDetectorRef);
    selectedReservation!: ReservationResponseDTO;

    async ngOnInit() {
        const query: QueryPanigation = {
            start: 0,
            perPage: 10
        };
        await firstValueFrom(this.slotService.getReservationsByStudent(query));
        await firstValueFrom(this.slotService.getReservationsByTeacher(query));
    }
    customSort(event: any) {
        console.log('Event on sort :', event);
    }

    onSort($event: any) {
        console.log('Event on sort :', $event);
        let query: QueryPanigation = {
            start: 0,
            perPage: 10
        };
        if ($event.field === 'date') {
            query = {
                start: 0,
                perPage: 10,
                orderByDate: $event.order
            };
            this.slotService.getReservationsByStudent(query).subscribe((x) => {
                this.reservations.set(x);
                this.cdr.detectChanges();
            });
            this.slotService.getReservationsByStudent(query).subscribe((x) => this.reservations.set([...x]));
        }
        if ($event.field === 'name') {
            query = {
                start: 0,
                perPage: 10,
                orderByName: $event.order
            };
            this.slotService.getReservationsByStudent(query).subscribe(() => this.cdr.detectChanges());
        }
    }
}
