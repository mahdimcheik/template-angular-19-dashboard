import { inject, Injectable } from '@angular/core';
import { SlotService } from './slot.service';
import { HttpClient } from '@angular/common/http';
import { CheckoutRequest, CheckoutResponse } from '../models/order';
import { OrderService } from './order.service';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ResponseDTO } from '../models/user';
import { environment } from '../../../environments/environment.development';

@Injectable({
    providedIn: 'root'
})
export class PaymentsService {
    baseUrl = environment.BACK_URL;

    slotService = inject(SlotService);
    orderService = inject(OrderService);
    http = inject(HttpClient);

    getcheckout(orderId: string): Observable<CheckoutResponse> {
        return this.http.post<ResponseDTO>(`${this.baseUrl}/payments/create-checkout-session`, { orderId: orderId } as CheckoutRequest).pipe(
            catchError((err) => {
                return throwError(() => err);
            }),
            map((response) => response.data as CheckoutResponse)
        );
    }
}
