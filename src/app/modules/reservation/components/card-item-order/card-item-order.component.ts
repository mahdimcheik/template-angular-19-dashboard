import { Component, input, OnInit, signal } from '@angular/core';
import { BookingCreateDTO, BookingResponseDTO, SlotResponseDTO } from '../../../../shared/models/slot';
import { OrderStatusPipe } from '../../../../shared/pipes/order-status.pipe';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { HelpTypePipe } from '../../../../shared/pipes/help-type.pipe';

@Component({
    selector: 'app-card-item-order',
    imports: [OrderStatusPipe, ButtonModule, CommonModule, HelpTypePipe],

    templateUrl: './card-item-order.component.html',
    styleUrl: './card-item-order.component.scss'
})
export class CardItemOrderComponent {
    booking = input.required<BookingResponseDTO>();
    detailed = input<boolean>(false);
    orderNumber = input.required<string>();
    orderStatus = input.required<number>();
}
