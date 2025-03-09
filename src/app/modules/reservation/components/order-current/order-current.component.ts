import { Component, input } from '@angular/core';
import { OrderResponseDTO } from '../../../../shared/models/order';

@Component({
    selector: 'app-order-current',
    standalone: false,

    templateUrl: './order-current.component.html',
    styleUrl: './order-current.component.scss'
})
export class OrderCurrentComponent {
    currentOrder = input.required<OrderResponseDTO>();
}
