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
import { environment } from '../../../environments/environment';
import { SlotMainService } from './slotMain.service';
import { ResponseDTO } from './userMain.service';

/**
 * Service pour gérer les paiements.
 * Fournit une méthode pour créer une session de paiement via l'API.
 * Utilise HttpClient pour les appels API.
 */
@Injectable({
    providedIn: 'root'
})
export class PaymentsService {
    baseUrl = environment.BACK_URL;

    slotService = inject(SlotMainService);
    orderService = inject(OrderMainService);
    http = inject(HttpClient);

    /**
     * Crée une session de paiement pour une commande.
     * @param orderId ID de la commande pour laquelle on veut créer une session de paiement
     * @returns Un observable contenant les informations de la session de paiement
     */
    getcheckout(orderId: string): Observable<CheckoutResponse> {
        return this.http.post<ResponseDTO>(`${this.baseUrl}/payments/create-checkout-session`, { orderId: orderId } as CheckoutRequest).pipe(
            catchError((err) => {
                return throwError(() => err);
            }),
            map((response) => response.data as CheckoutResponse)
        );
    }
}
