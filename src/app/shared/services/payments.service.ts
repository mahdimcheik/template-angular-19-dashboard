import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CheckoutRequest } from '../../api/models/CheckoutRequest';
import { OrderMainService } from './orderMain.service';

// Type for checkout response - keeping the existing interface
export type CheckoutResponse = {
    sessionId: string;
    url: string;
};
import { catchError, map, Observable, throwError } from 'rxjs';
import { ResponseDTO } from '../models/user';
import { environment } from '../../../environments/environment.development';
import { SlotMainService } from './slotMain.service';

@Injectable({
    providedIn: 'root'
})
export class PaymentsService {
    baseUrl = environment.BACK_URL;

    slotService = inject(SlotMainService);
    orderService = inject(OrderMainService);
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
