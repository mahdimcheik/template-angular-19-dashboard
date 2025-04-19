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
import { OrdersHistoryComponent } from '../../components/orders-history/orders-history.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-orders',
    imports: [FormsModule, ButtonModule, ToolbarModule, IconFieldModule, InputNumberModule, InputIconModule, InputTextModule, FullCalendarModule, CommonModule, OrderCurrentComponent, OrdersHistoryComponent],

    templateUrl: './orders.component.html',
    styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {
    orderService = inject(OrderService);
    currentOrder = this.orderService.currentOrder;

    router = inject(Router);
    ngOnInit(): void {
        try {
            this.orderService.getCurrentOrder().subscribe();
        } catch (e) {
            console.log(e);
        }
    }
}
