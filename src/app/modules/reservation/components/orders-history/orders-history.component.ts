import { Component, inject, OnInit, signal } from '@angular/core';
import { OrderComponent } from '../order/order.component';
import { CommonModule } from '@angular/common';
import { OrderResponseDTO } from '../../../../shared/models/order';
import { AuthService } from '../../../../shared/services/auth.service';
import { OrderService } from '../../../../shared/services/order.service';
import { PaginatorModule } from 'primeng/paginator';
import { OrderPagination } from '../../../../shared/models/slot';

@Component({
    selector: 'app-orders-history',
    imports: [OrderComponent, CommonModule, PaginatorModule],
    templateUrl: './orders-history.component.html',
    styleUrl: './orders-history.component.scss'
})
export class OrdersHistoryComponent implements OnInit {
    authService = inject(AuthService);
    orderService = inject(OrderService);

    paidOrders = this.orderService.paidOrders;
    totalRecords = this.orderService.ordersCount;

    first = 0; // premier element
    rows = 10; // reservations par page

    currentUser = this.authService.userConnected;
    orders = this.orderService.paidOrders;

    //filter
    filter: OrderPagination = {
        start: this.first,
        perPage: this.rows,
        orderByDate: 1
    };

    ngOnInit(): void {
        this.orderService.getPaidOrders(this.filter).subscribe();
    }

    loadOrders(event: any) {
        this.first = event.first;
        this.rows = event.rows;

        this.filter.start = this.first;
        this.filter.perPage = this.rows;

        this.orderService.getPaidOrders(this.filter).subscribe();
    }
}
