import { ChangeDetectionStrategy, Component, inject, OnInit, ViewChild, ChangeDetectorRef, computed, input, signal } from '@angular/core';
import { SlotService } from '../../../../shared/services/slot.service';
import { QueryPanigation, BookingResponseDTO } from '../../../../shared/models/slot';
import { delay, firstValueFrom } from 'rxjs';
import { SortEvent } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
    selector: 'app-reservation-list-by-teacher',
    imports: [ButtonModule, DatePipe, TableModule, CurrencyPipe, PaginatorModule, CommonModule],

    templateUrl: './reservation-list-by-teacher.component.html',
    styleUrl: './reservation-list-by-teacher.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReservationListByTeacherComponent implements OnInit {
    @ViewChild('dt') dt!: Table;
    slotService = inject(SlotService);
    authService = inject(AuthService);

    reservations = signal([] as BookingResponseDTO[]);
    totalReservations = signal(0);

    selectedReservation!: BookingResponseDTO;
    dateNow = computed(() => new Date());
    upComing = input<boolean>();
    first = 0; // premier element
    rows = 10; // reservations par page
    query: QueryPanigation = {
        start: 0,
        perPage: 10
    };

    ngOnInit() {
        this.query = {
            start: 0,
            perPage: 10,
            orderByDate: 1,
            orderByName: 1
        };
        if (this.upComing() == true) {
            this.query.fromDate = new Date();
        } else if (this.upComing() == false) {
            this.query.toDate = new Date();
        }

        // si admin => get reservations by teacher sinon get reservations by student
        this.authService.isAdmin()
            ? this.slotService.getReservationsByTeacher(this.query).subscribe((res) => {
                  this.reservations.set(res.data);
                  this.totalReservations.set(res.count ?? 0);
              })
            : this.slotService.getReservationsByStudent(this.query).subscribe((res) => {
                  this.reservations.set(res.data);
                  this.totalReservations.set(res.count ?? 0);
              });
    }

    async loadReservations($event: any) {
        this.query.start = $event.first;
        this.query.perPage = $event.rows;

        this.slotService.getReservationsByTeacher(this.query).subscribe((res) => {
            this.reservations.set(res.data);
            this.totalReservations.set(res.count ?? 0);
        });
    }
}
