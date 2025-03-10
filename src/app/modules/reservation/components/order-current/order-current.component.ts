import { Component, inject, input } from '@angular/core';
import { OrderResponseDTO } from '../../../../shared/models/order';
import { OrderService } from '../../../../shared/services/order.service';
import { PaymentsService } from '../../../../shared/services/payments.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-order-current',
    standalone: false,

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
