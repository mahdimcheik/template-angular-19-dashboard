import { Component, inject, OnInit } from '@angular/core';
import { OrderResponseDTO } from '../../../../shared/models/order';
import { OrderService } from '../../../../shared/services/order.service';

@Component({
    selector: 'app-orders',
    standalone: false,

    templateUrl: './orders.component.html',
    styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {
    orderService = inject(OrderService);
    currentOrder = this.orderService.currentOrder;
    ngOnInit(): void {
        try {
            this.orderService.getCurrentOrder().subscribe((res) => {
                console.log(res);
                console.log(this.currentOrder());
            });
        } catch (e) {
            console.log(e);
        }
    }
}
