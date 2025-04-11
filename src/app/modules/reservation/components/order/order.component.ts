import { Component, inject, input } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { FieldsetModule } from 'primeng/fieldset';
import { OrderResponseDTO } from '../../../../shared/models/order';
import { CommonModule, DatePipe } from '@angular/common';
import { ReservationLineByTeacherComponent } from '../reservation-line-by-teacher/reservation-line-by-teacher.component';
import { CardItemOrderComponent } from '../card-item-order/card-item-order.component';
import { ButtonModule } from 'primeng/button';
import { OrderService } from '../../../../shared/services/order.service';

@Component({
    selector: 'app-order',
    imports: [AccordionModule, FieldsetModule, DatePipe, CommonModule, ButtonModule],
    templateUrl: './order.component.html',
    styleUrl: './order.component.scss'
})
export class OrderComponent {
    orderService = inject(OrderService);
    order = input<OrderResponseDTO>();

    getBill() {
        console.log('Get Bill');

        if (this.order() && this.order()?.id && this.order()?.id !== '') {
            this.orderService.getBill(this.order()?.id ?? '').subscribe((res) => {
                console.log('Bill', res);
            });
        }
    }
}
