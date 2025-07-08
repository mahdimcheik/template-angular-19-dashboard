import { Component, inject, input } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { FieldsetModule } from 'primeng/fieldset';
import { OrderResponseDTO } from '../../../../shared/services/orderMain.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ReservationLineByTeacherComponent } from '../reservation-line-by-teacher/reservation-line-by-teacher.component';
import { CardItemOrderComponent } from '../card-item-order/card-item-order.component';
import { ButtonModule } from 'primeng/button';
import { OrderMainService } from '../../../../shared/services/orderMain.service';
import { MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-order',
    imports: [AccordionModule, FieldsetModule, DatePipe, CommonModule, ButtonModule, TooltipModule],
    templateUrl: './order.component.html',
    styleUrl: './order.component.scss'
})
export class OrderComponent {
    orderService = inject(OrderMainService);
    order = input<OrderResponseDTO>();
    messageService = inject(MessageService);

    getBill() {
        console.log('Get Bill');

        if (this.order() && this.order()?.id && this.order()?.id !== '') {
            this.orderService.getBill(this.order()?.id ?? '').subscribe((res: Blob) => {
                console.log('Bill', res);
            });
        }
    }

    async copyOrderDetails(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        var orderDetail = {
            id: this.order()?.id,
            OrderNumber: this.order()?.orderNumber
        };
        await navigator.clipboard.writeText(JSON.stringify(orderDetail));
        this.messageService.add({
            severity: 'info',
            summary: 'Copié',
            detail: 'Détails de la commande copiés dans le presse-papiers',
            life: 3000
        });
    }
}
