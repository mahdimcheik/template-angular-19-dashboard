import { Component, ElementRef, OnInit, ViewChild, inject, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { BookingResponseDTO } from '../../../../api/models/BookingResponseDTO';
import { SlotMainService } from '../../../../shared/services/slotMain.service';
import { HelpTypePipe } from '../../../../shared/pipes/help-type.pipe';
import { UserMainService } from '../../../../shared/services/userMain.service';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalReservationDetailsComponent } from '../modal-reservation-details/modal-reservation-details.component';
import { BehaviorSubject, debounceTime, distinctUntilChanged, finalize } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-reservations-list-detailed',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, InputTextModule, PaginatorModule, HelpTypePipe, IconFieldModule, InputIconModule, TooltipModule, ModalReservationDetailsComponent],
    templateUrl: './reservations-list-detailed.component.html',
    styleUrls: ['./reservations-list-detailed.component.scss']
})
export class ReservationsListDetailedComponent implements OnInit {
    authService = inject(UserMainService);
    router = inject(Router);
    activatedRoute = inject(ActivatedRoute);

    @ViewChild('dt') dt!: Table;
    private slotService = inject(SlotMainService);

    searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

    reservations = this.slotService.bookings;
    totalRecords = this.slotService.totalReservations;
    loading = false;

    first = 0;
    rows = 10;
    searchWord = new BehaviorSubject<string | undefined>('');
    searchWordDebounced = this.searchWord.pipe(debounceTime(300), distinctUntilChanged());

    // Modal state
    visibleDetailsModal = signal<boolean>(false);
    selectedReservation = signal<BookingResponseDTO>({} as BookingResponseDTO);

    ngOnInit() {
        // this.loadReservations();
        // cas ou on cherche
        this.searchWordDebounced.subscribe((value) => {
            this.first = 0;
            this.rows = 10;
            this.loadReservations();
        });

        this.activatedRoute.queryParams.subscribe(async (params) => {
            const reservationId = params['reservationId'] ?? '';
            if (reservationId) {
                this.searchWord.next(reservationId);
                this.loading = true;
                while (this.loading) {
                    await new Promise((resolve) => setTimeout(resolve, 100));
                }
                this.selectedReservation.set(this.reservations().find((r: any) => r.id === reservationId) || ({} as BookingResponseDTO));
                if (this.selectedReservation()) {
                    this.showDetailsModal(this.selectedReservation());
                }
            }
        });
    }

    loadReservations() {
        this.loading = true;
        if ((this.authService as any).isAdmin()) {
            this.slotService
                .getReservationsByTeacher({
                    start: this.first,
                    perPage: this.rows,
                    searchWord: this.searchWord.value
                })
                .pipe(finalize(() => (this.loading = false)))
                .subscribe(() => {});
        } else {
            this.slotService
                .getReservationsByStudent({
                    start: this.first,
                    perPage: this.rows,
                    searchWord: this.searchWord.value
                })
                .pipe(finalize(() => (this.loading = false)))
                .subscribe(() => {});
        }
    }

    onPageChange(event: any) {
        this.first = event.first;
        this.rows = event.rows;
        this.loadReservations();
    }

    onGlobalFilter(event: Event) {
        this.first = 0; // Reset to first page on filter change
        this.rows = 10; // Reset to default rows per page
        const input = event.target as HTMLInputElement;
        const value = input.value;
        this.searchWord.next(value);
    }

    formatDate(date: Date): string {
        return new Date(date).toLocaleString();
    }

    onViewDetails(reservation: BookingResponseDTO) {
        this.router.navigate(['/dashboard/reservation/details', reservation.id]);
    }

    showDetailsModal(reservation: BookingResponseDTO) {
        this.selectedReservation.set(reservation);
        this.visibleDetailsModal.set(true);
        console.log('Showing details for reservation:', reservation);
    }

    closeDetailsModal() {
        this.visibleDetailsModal.set(false);
    }
}
