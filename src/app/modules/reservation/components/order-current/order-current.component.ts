import { Component, inject, input } from '@angular/core';
import { OrderResponseDTO } from '../../../../shared/models/order';
import { OrderService } from '../../../../shared/services/order.service';
import { PaymentsService } from '../../../../shared/services/payments.service';
import { Router } from '@angular/router';
import { OrderStatusPipe } from '../../../../shared/pipes/order-status.pipe';
import { ButtonModule } from 'primeng/button';
import { CommonModule, DatePipe } from '@angular/common';
import { CardItemOrderComponent } from '../card-item-order/card-item-order.component';

@Component({
    selector: 'app-order-current',
    imports: [ButtonModule, OrderStatusPipe, DatePipe, CardItemOrderComponent, CommonModule],
    templateUrl: './order-current.component.html',
    styleUrl: './order-current.component.scss'
})
export class OrderCurrentComponent {
    paymentsService = inject(PaymentsService);
    orderService = inject(OrderService);
    router = inject(Router);
    currentOrder = input.required<OrderResponseDTO>();

    getcheckout() {
        this.paymentsService
            .getcheckout(this.orderService.currentOrder().id)
            .pipe()
            .subscribe((checkoutResponse) => {
                // this.router.navigate([checkoutResponse.url]);
                window.location.href = checkoutResponse.url;
            });
    }
}
