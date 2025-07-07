import { Component, inject, input, output, signal } from '@angular/core';
import { BookingResponseDTO } from '../../../../shared/models/slot';
import { OrderStatusPipe } from '../../../../shared/pipes/order-status.pipe';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { HelpTypePipe } from '../../../../shared/pipes/help-type.pipe';
import { ModalDetailsReservationComponent } from '../modal-details-reservation/modal-details-reservation.component';
import { ModalConfirmDeleteComponent } from '../../../profile/components/modal-confirm-delete/modal-confirm-delete.component';
import { SlotService } from '../../../../shared/services/slot.service';
import { catchError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ResponseDTO } from '../../../../shared/models/user';
import { OrderService } from '../../../../shared/services/order.service';

@Component({
    selector: 'app-card-item-order',
    imports: [OrderStatusPipe, ModalConfirmDeleteComponent, ButtonModule, CommonModule, HelpTypePipe, ModalDetailsReservationComponent, ModalDetailsReservationComponent, ModalConfirmDeleteComponent],

    templateUrl: './card-item-order.component.html',
    styleUrl: './card-item-order.component.scss'
})
export class CardItemOrderComponent {
    booking = input.required<BookingResponseDTO>();
    showDetails = signal(false);
    confirmDelete = signal(false);

    detailed = input<boolean>(false);
    orderNumber = input.required<string>();
    orderStatus = input.required<number>();

    slotService = inject(SlotService);
    orderService = inject(OrderService);
    messageService = inject(MessageService);

    deleteReservation() {
        this.slotService
            .unbookReservationByStudent(this.booking().slotId)
            .pipe(
                catchError((err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Une erreur est survenue lors de la suppression de la réservation.'
                    });
                    return err;
                })
            )
            .subscribe((res) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Réservation supprimée',
                    detail: (res as ResponseDTO)?.message
                });
                this.confirmDelete.set(false);
                this.orderService.getCurrentOrder().subscribe();
            });
    }
}
