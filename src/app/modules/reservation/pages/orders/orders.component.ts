import { Component, inject, OnInit } from '@angular/core';
import { OrderService } from '../../../../shared/services/order.service';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CommonModule } from '@angular/common';
import { OrderCurrentComponent } from '../../components/order-current/order-current.component';
import { IconFieldModule } from 'primeng/iconfield';
import { ToolbarModule } from 'primeng/toolbar';
import { OrderComponent } from '../../components/order/order.component';
import { OrdersHistoryComponent } from '../../components/orders-history/orders-history.component';

@Component({
    selector: 'app-orders',
    imports: [ButtonModule, ToolbarModule, IconFieldModule, InputNumberModule, InputIconModule, InputTextModule, FullCalendarModule, CommonModule, OrderCurrentComponent, OrderComponent, OrdersHistoryComponent],

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
