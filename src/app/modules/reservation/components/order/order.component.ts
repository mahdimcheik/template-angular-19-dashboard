import { Component, input } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { FieldsetModule } from 'primeng/fieldset';
import { OrderResponseDTO } from '../../../../shared/models/order';
import { CommonModule, DatePipe } from '@angular/common';
import { ReservationLineByTeacherComponent } from '../reservation-line-by-teacher/reservation-line-by-teacher.component';
import { CardItemOrderComponent } from '../card-item-order/card-item-order.component';

@Component({
    selector: 'app-order',
    imports: [AccordionModule, FieldsetModule, DatePipe, ReservationLineByTeacherComponent, ReservationLineByTeacherComponent, CommonModule],
    templateUrl: './order.component.html',
    styleUrl: './order.component.scss'
})
export class OrderComponent {
    order = input<OrderResponseDTO>();
}
