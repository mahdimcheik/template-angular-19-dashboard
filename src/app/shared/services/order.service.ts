import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ResponseDTO } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { OrderResponseDTO } from '../models/order';
import { environment } from '../../../environments/environment.development';
import { OrderPagination } from '../models/slot';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    currentOrder = signal<OrderResponseDTO>({} as OrderResponseDTO);
    paidOrders = signal<OrderResponseDTO[]>([] as OrderResponseDTO[]);
    ordersCount = signal<number>(0);

    http = inject(HttpClient);
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

    getBill(orderId: string): Observable<ResponseDTO> {
        return this.http.get<ResponseDTO>(`${this.baseUrl}/bill?orderId=${orderId}`).pipe(
            tap((res) => {
                console.log('Bill', res);
            })
        );
    }
}
