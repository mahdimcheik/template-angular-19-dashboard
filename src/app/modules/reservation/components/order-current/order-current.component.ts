import { Component, inject, input, signal } from '@angular/core';
import { OrderResponseDTO } from '../../../../shared/services/orderMain.service';
import { OrderMainService } from '../../../../shared/services/orderMain.service';
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
    orderService = inject(OrderMainService);
    router = inject(Router);
    currentOrder = input.required<OrderResponseDTO>();
    visibleModalDetails = signal(false);

    getcheckout() {
        this.paymentsService.getcheckout(this.orderService.currentOrder().id!).subscribe((checkoutResponse) => {
            window.location.href = checkoutResponse.url;
        });
    }
}
