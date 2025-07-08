import { Component, inject, input, model, output } from '@angular/core';
import { HelpTypePipe } from '../../../../shared/pipes/help-type.pipe';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { BookingResponseDTO } from '../../../../api/models/BookingResponseDTO';
import { MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-modal-details-reservation',
    imports: [HelpTypePipe, InputTextModule, TextareaModule, MessageModule, ButtonModule, FluidModule, SelectModule, CommonModule, ReactiveFormsModule, DialogModule, TooltipModule],

    templateUrl: './modal-details-reservation.component.html',
    styleUrl: './modal-details-reservation.component.scss'
})
export class ModalDetailsReservationComponent {
    visible = model<boolean>(false);
    onUnbook = output<string>();
    allowDelete = input<boolean>(true);

    messageService = inject(MessageService);

    reservation = input.required<BookingResponseDTO>();
    close() {
        this.visible.set(false);
    }
    unbook() {
        this.onUnbook.emit(this.reservation().id!);
        this.visible.set(false);
    }

    async copyOrderDetails() {
        await navigator.clipboard.writeText(this.reservation().orderNumber ?? '');
        this.messageService.add({
            severity: 'info',
            summary: 'Copié',
            detail: 'Détails de la commande copiés dans le presse-papiers',
            life: 3000
        });
    }
}
