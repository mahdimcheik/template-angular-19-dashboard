import { Component, OnInit, ViewChild, inject } from '@angular/core';
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
import { Router } from '@angular/router';

@Component({
    selector: 'app-reservations-list-detailed',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, InputTextModule, PaginatorModule, HelpTypePipe, IconFieldModule, InputIconModule, TooltipModule],
    templateUrl: './reservations-list-detailed.component.html',
    styleUrls: ['./reservations-list-detailed.component.scss']
})
export class ReservationsListDetailedComponent implements OnInit {
    authService = inject(UserMainService);
    router = inject(Router);

    @ViewChild('dt') dt!: Table;
    private slotService = inject(SlotMainService);

    reservations = this.slotService.bookings;
    totalRecords = this.slotService.totalReservations;
    loading = false;

    first = 0;
    rows = 10;

    ngOnInit() {
        this.loadReservations();
    }

    loadReservations() {
        this.loading = true;
        if ((this.authService as any).isAdmin()) {
            this.slotService
                .getReservationsByTeacher({
                    start: this.first,
                    perPage: this.rows
                })
                .subscribe(() => {
                    this.loading = false;
                });
        } else {
            this.slotService
                .getReservationsByStudent({
                    start: this.first,
                    perPage: this.rows
                })
                .subscribe(() => {
                    this.loading = false;
                });
        }
    }

    onPageChange(event: any) {
        this.first = event.first;
        this.rows = event.rows;
        this.loadReservations();
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    formatDate(date: Date): string {
        return new Date(date).toLocaleString();
    }

    onViewDetails(reservation: BookingResponseDTO) {
        this.router.navigate(['/dashboard/reservation/details', reservation.id]);
    }
}
