import { inject, Injectable, signal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { ResponseDTO } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { OrderResponseDTO } from '../models/order';
import { environment } from '../../../environments/environment.development';
import { OrderPagination } from '../models/slot';
import { MessageService } from 'primeng/api';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    currentOrder = signal<OrderResponseDTO>({} as OrderResponseDTO);
    paidOrders = signal<OrderResponseDTO[]>([] as OrderResponseDTO[]);
    ordersCount = signal<number>(0);

    http = inject(HttpClient);
    messageService = inject(MessageService);
    baseUrl = environment.BACK_URL;

    getCurrentOrder(): Observable<ResponseDTO> {
        return this.http.get<ResponseDTO>(`${this.baseUrl}/order/student/current`).pipe(
            tap((res) => {
                this.currentOrder.set(res?.data as OrderResponseDTO);
            })
        );
    }

    getPaidOrders(filter: OrderPagination) {
        return this.http.post<ResponseDTO>(`${this.baseUrl}/order/student/all`, filter).pipe(
            tap((res) => {
                this.paidOrders.set(res?.data as OrderResponseDTO[]);
                this.ordersCount.set(res?.count as number);
                console.log('Paid Orders', res);
            })
        );
    }

    getBill(orderId: string): Observable<Blob> {
        return this.http
            .get(`${this.baseUrl}/bill?orderId=${orderId}`, {
                responseType: 'blob'
            })
            .pipe(
                tap((blob) => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'facture.pdf'; // Nom du fichier
                    a.click();
                    window.URL.revokeObjectURL(url);

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: 'Votre facture est en cours de téléchargement',
                        life: 5000
                    });
                })
            );
    }
}
