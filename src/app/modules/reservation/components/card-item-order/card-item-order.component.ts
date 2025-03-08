import { Component, input, OnInit, signal } from '@angular/core';
import { BookingCreateDTO, BookingResponseDTO, SlotResponseDTO } from '../../../../shared/models/slot';

@Component({
    selector: 'app-card-item-order',
    standalone: false,

    templateUrl: './card-item-order.component.html',
    styleUrl: './card-item-order.component.scss'
})
export class CardItemOrderComponent {
    booking = input.required<BookingResponseDTO>();
}
