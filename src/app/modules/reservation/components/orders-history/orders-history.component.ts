import { Component, DestroyRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { OrderComponent } from '../order/order.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../shared/services/auth.service';
import { OrderService } from '../../../../shared/services/order.service';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { OrderPagination } from '../../../../shared/models/slot';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { InputIconModule } from 'primeng/inputicon';
import { FormsModule } from '@angular/forms';
import { IconField } from 'primeng/iconfield';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OrderResponseDTO } from '../../../../shared/models/order';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-orders-history',
    imports: [OrderComponent, CommonModule, PaginatorModule, ToolbarModule, ButtonModule, InputIconModule, FormsModule, IconField, InputTextModule],
    templateUrl: './orders-history.component.html',
    styleUrl: './orders-history.component.scss'
})
export class OrdersHistoryComponent implements OnInit {
    authService = inject(AuthService);
    orderService = inject(OrderService);

    //pagination
    first = 0; // premier element
    rows = 10; // reservations par page
    count = 0; // nombre total de reservations
    paginatorRef = viewChild<Paginator>('paginator');

    currentUser = this.authService.userConnected;
    orders = this.orderService.paidOrders;

    //filter
    filter: OrderPagination = {
        start: this.first,
        perPage: this.rows,
        orderByDate: 1
    };

    // input word
    searchWord = '';
    searchSubject$ = new Subject<string>();

    // destroy reference
    destroyRef = inject(DestroyRef);

    ngOnInit(): void {
        this.searchSubject$.pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef)).subscribe((res) => {
            this.filter.searchField = res;
            this.filter.start = 0;
            this.filter.perPage = this.rows;

            this.orderService.getPaidOrders(this.filter).subscribe((res) => {
                this.count = res.count ?? 0;
                this.orders.set(res.data);
                if (this.paginatorRef()) {
                    this.paginatorRef()?.updateFirst();
                }
            });
        });
        this.orderService.getPaidOrders(this.filter).subscribe((res) => {
            this.count = res.count ?? 0;
        });
    }

    loadOrders(event: any) {
        this.first = event.first;
        this.rows = event.rows;

        this.filter.start = this.first;
        this.filter.perPage = this.rows;

        this.orderService.getPaidOrders(this.filter).subscribe();
    }

    searchOrder() {
        this.searchSubject$.next(this.searchWord);
    }
}
