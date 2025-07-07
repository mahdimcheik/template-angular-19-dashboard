import { Component, inject, input, signal } from '@angular/core';
import { OrderResponseDTO } from '../../../../shared/models/order';
import { OrderService } from '../../../../shared/services/order.service';
import { PaymentsService } from '../../../../shared/services/payments.service';
import { Router } from '@angular/router';
import { OrderStatusPipe } from '../../../../shared/pipes/order-status.pipe';
import { ButtonModule } from 'primeng/button';
import { CommonModule, DatePipe } from '@angular/common';
import { CardItemOrderComponent } from '../card-item-order/card-item-order.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-order-current',
    imports: [ButtonModule, OrderStatusPipe, DatePipe, CardItemOrderComponent, CommonModule, InputNumberModule, InputIconModule, InputTextModule],
    templateUrl: './order-current.component.html',
    styleUrl: './order-current.component.scss'
})
export class OrderCurrentComponent {
    paymentsService = inject(PaymentsService);
    orderService = inject(OrderService);
    router = inject(Router);
    currentOrder = input.required<OrderResponseDTO>();
    visibleModalDetails = signal(false);

    getcheckout() {
        this.paymentsService.getcheckout(this.orderService.currentOrder().id).subscribe((checkoutResponse) => {
            window.location.href = checkoutResponse.url;
        });
    }
}
