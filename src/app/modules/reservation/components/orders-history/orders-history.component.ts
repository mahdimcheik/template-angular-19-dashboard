import { Component, inject, OnInit, signal } from '@angular/core';
import { OrderComponent } from '../order/order.component';
import { CommonModule } from '@angular/common';
import { OrderResponseDTO } from '../../../../shared/models/order';
import { AuthService } from '../../../../shared/services/auth.service';
import { OrderService } from '../../../../shared/services/order.service';
import { PaginatorModule } from 'primeng/paginator';

@Component({
    selector: 'app-orders-history',
    imports: [OrderComponent, CommonModule, PaginatorModule],
    templateUrl: './orders-history.component.html',
    styleUrl: './orders-history.component.scss'
})
export class OrdersHistoryComponent implements OnInit {
    authService = inject(AuthService);
    orderService = inject(OrderService);

    currentUser = this.authService.userConnected;
    orders = this.orderService.paidOrders;

    ngOnInit(): void {
        this.orderService.getPaidOrders().subscribe();
    }
}
