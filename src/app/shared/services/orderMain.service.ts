import { inject, Injectable, signal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { OrderService as GeneratedOrderService } from '../../api/services/OrderService';
import { BillService as GeneratedBillService } from '../../api/services/BillService';
import { OrderResponseForStudentDTO } from '../../api/models/OrderResponseForStudentDTO';
import { OrderPagination as GeneratedOrderPagination } from '../../api/models/OrderPagination';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { ResponseDTO } from './userMain.service';
import { environment } from '../../../environments/environment.development';

// Type aliases to maintain backward compatibility
export type OrderResponseDTO = OrderResponseForStudentDTO;
export type OrderPagination = GeneratedOrderPagination;

@Injectable({
    providedIn: 'root'
})
export class OrderMainService {
    private generatedOrderService = inject(GeneratedOrderService);
    private generatedBillService = inject(GeneratedBillService);
    private http = inject(HttpClient);
    messageService = inject(MessageService);

    currentOrder = signal<OrderResponseDTO>({} as OrderResponseDTO);
    paidOrders = signal<OrderResponseDTO[]>([] as OrderResponseDTO[]);
    ordersCount = signal<number>(0);

    getCurrentOrder(): Observable<ResponseDTO> {
        return this.generatedOrderService.getOrderStudentCurrent().pipe(
            map((response) => ({
                message: response.message || 'Success',
                status: response.status || 200,
                data: response.data || {},
                count: response.count || 0
            })),
            tap((res) => {
                this.currentOrder.set(res?.data as OrderResponseDTO);
            })
        );
    }

    getPaidOrders(filter: OrderPagination): Observable<ResponseDTO> {
        return this.generatedOrderService.postOrderStudentAll(filter).pipe(
            map((response) => ({
                message: response.message || 'Success',
                status: response.status || 200,
                data: response.data || [],
                count: response.count || 0
            })),
            tap((res) => {
                this.paidOrders.set(res?.data as OrderResponseDTO[]);
                this.ordersCount.set(res?.count as number);
            })
        );
    }

    getBill(orderId: string): Observable<Blob> {
        return this.http.get(`${environment.BACK_URL}/bill/export?orderId=${orderId}`, { responseType: 'blob' }).pipe(
            tap((blob) => {
                console.log('telechargment');

                const url = window.URL.createObjectURL(blob as Blob);
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
