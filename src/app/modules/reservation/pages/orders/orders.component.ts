import { Component, inject, OnInit } from '@angular/core';
import { OrderResponseDTO } from '../../../../shared/models/order';
import { OrderService } from '../../../../shared/services/order.service';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CommonModule } from '@angular/common';
import { HelpTypePipe } from '../../../../shared/pipes/help-type.pipe';
import { OrderCurrentComponent } from '../../components/order-current/order-current.component';
import { IconFieldModule } from 'primeng/iconfield';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
    selector: 'app-orders',
    imports: [ButtonModule, ToolbarModule, IconFieldModule, InputNumberModule, InputIconModule, InputTextModule, FullCalendarModule, CommonModule, OrderCurrentComponent],

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
