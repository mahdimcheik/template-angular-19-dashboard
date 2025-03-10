import { inject, Injectable } from '@angular/core';
import { SlotService } from './slot.service';
import { HttpClient } from '@angular/common/http';
import { CheckoutRequest, CheckoutResponse } from '../models/order';
import { OrderService } from './order.service';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ResponseDTO } from '../models/user';

@Injectable({
    providedIn: 'root'
})
export class PaymentsService {
    slotService = inject(SlotService);
    orderService = inject(OrderService);
    http = inject(HttpClient);

    constructor() {}

    getcheckout(orderId: string): Observable<CheckoutResponse> {
        return this.http.post<ResponseDTO>('https://localhost:7113/api/payments/create-checkout-session', { orderId: orderId } as CheckoutRequest).pipe(
            catchError((err) => {
                console.error('Error getting checkout', err);
                return throwError(() => err);
            }),
            map((response) => response.data as CheckoutResponse)
        );
    }
}
