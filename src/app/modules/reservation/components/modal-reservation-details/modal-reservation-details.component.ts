import { Component, computed, inject, input, model, output } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { BookingResponseDTO } from '../../../../api/models/BookingResponseDTO';
import { EnumTypeHelp } from '../../../../api/models/EnumTypeHelp';
import { Router } from '@angular/router';
import { UserMainService } from '../../../../shared/services/userMain.service';

@Component({
    selector: 'app-modal-reservation-details',
    standalone: true,
    imports: [CommonModule, DrawerModule, ButtonModule],
    templateUrl: './modal-reservation-details.component.html',
    styleUrl: './modal-reservation-details.component.scss'
})
export class ModalReservationDetailsComponent {
    private router = inject(Router);
    authService = inject(UserMainService);

    visibleRight = model<boolean>(false);
    reservation = input.required<BookingResponseDTO>();
    onClose = output<boolean>();

    close() {
        this.visibleRight.set(false);
        this.onClose.emit(false);
    }

    formatDateTime(dateString: string | undefined): string {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    calculateDuration(startAt: string | undefined, endAt: string | undefined): string {
        if (!startAt || !endAt) return 'N/A';

        const start = new Date(startAt);
        const end = new Date(endAt);
        const diffMs = end.getTime() - start.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        if (diffHours > 0) {
            return diffMinutes > 0 ? `${diffHours}h ${diffMinutes}min` : `${diffHours}h`;
        }
        return `${diffMinutes}min`;
    }

    viewCommunications() {
        const reservationId = this.reservation().id;
        if (reservationId) {
            this.close();
            this.router.navigate(['/dashboard/reservation/communications', reservationId]);
        }
    }

    getHelpType(typeHelp: EnumTypeHelp | undefined): string {
        switch (typeHelp) {
            case EnumTypeHelp._0:
                return 'Autre';
            case EnumTypeHelp._1:
                return 'Aides aux devoirs';
            case EnumTypeHelp._2:
                return 'Péparation aux examens';
            default:
                return 'Non défini';
        }
    }

    formatCurrency(amount: number | undefined): string {
        if (!amount) return '0,00 €';
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    }
}
