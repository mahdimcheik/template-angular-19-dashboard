import { ChangeDetectionStrategy, Component, inject, OnInit, ViewChild, ChangeDetectorRef, computed, input, signal } from '@angular/core';
import { SlotMainService } from '../../../../shared/services/slotMain.service';
import { QueryPanigation } from '../../../../shared/services/slotMain.service';
import { BookingResponseDTO } from '../../../../api/models/BookingResponseDTO';
import { delay, firstValueFrom } from 'rxjs';
import { SortEvent } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { AuthService } from '../../../../shared/services/auth.service';
import { ModalDetailsReservationComponent } from '../modal-details-reservation/modal-details-reservation.component';

@Component({
    selector: 'app-reservation-list',
    imports: [ButtonModule, DatePipe, TableModule, CurrencyPipe, PaginatorModule, CommonModule, ModalDetailsReservationComponent],

    templateUrl: './reservation-list-by-teacher.component.html',
    styleUrl: './reservation-list-by-teacher.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReservationListComponent implements OnInit {
    @ViewChild('dt') dt!: Table;
    slotService = inject(SlotMainService);
    authService = inject(AuthService);

    reservations = signal([] as BookingResponseDTO[]);
    totalReservations = signal(0);
    // modals details variables
    reservationToShow = signal({} as BookingResponseDTO);
    showDetails = signal(false);

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
            this.query.fromDate = new Date().toISOString();
        } else if (this.upComing() == false) {
            this.query.toDate = new Date().toISOString();
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

    showDetailsModal(reservation: BookingResponseDTO) {
        this.reservationToShow.set(reservation);
        this.showDetails.set(true);
    }
}
