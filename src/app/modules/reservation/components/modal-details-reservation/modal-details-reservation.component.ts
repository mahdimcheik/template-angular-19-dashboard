import { Component, input, model, output } from '@angular/core';
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
import { BookingResponseDTO, SlotResponseDTO } from '../../../../shared/models/slot';

@Component({
    selector: 'app-modal-details-reservation',
    imports: [HelpTypePipe, InputTextModule, TextareaModule, MessageModule, ButtonModule, FluidModule, SelectModule, CommonModule, ReactiveFormsModule, DialogModule],

    templateUrl: './modal-details-reservation.component.html',
    styleUrl: './modal-details-reservation.component.scss'
})
export class ModalDetailsReservationComponent {
    visible = model<boolean>(false);
    onUnbook = output<string>();
    reservation = input.required<BookingResponseDTO>();
    close() {
        this.visible.set(false);
    }
    unbook() {
        this.onUnbook.emit(this.reservation().id);
        this.visible.set(false);
    }
}
