import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { OrderStatusPipe } from '../../../../shared/pipes/order-status.pipe';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-payment-success',
    imports: [ButtonModule],

    templateUrl: './payment-success.component.html',
    styleUrl: './payment-success.component.scss'
})
export class PaymentSuccessComponent {}
