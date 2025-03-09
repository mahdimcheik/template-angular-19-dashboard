import { Pipe, PipeTransform } from '@angular/core';
import { EnumOrderStatus } from '../models/order';

@Pipe({
    name: 'orderStatus'
})
export class OrderStatusPipe implements PipeTransform {
    transform(status: EnumOrderStatus): string {
        switch (status) {
            case EnumOrderStatus.pending:
                return 'En attente';
            case EnumOrderStatus.paid:
                return 'Payé';
            case EnumOrderStatus.canceled:
                return 'Annulé';
            default:
                return 'Non défini';
        }
    }
}
