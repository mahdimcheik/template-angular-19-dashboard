import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ResponseDTO } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { OrderResponseDTO } from '../models/order';
import { environment } from '../../../environments/environment.development';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    currentOrder = signal<OrderResponseDTO>({} as OrderResponseDTO);
    paidOrders = signal<OrderResponseDTO[]>([] as OrderResponseDTO[]);

    http = inject(HttpClient);
    baseUrl = environment.BACK_URL;

    getCurrentOrder(): Observable<ResponseDTO> {
        return this.http.get<ResponseDTO>(`${this.baseUrl}/order/student/current`).pipe(
            tap((res) => {
                this.currentOrder.set(res?.data as OrderResponseDTO);
            })
        );
    }

    getPaidOrders() {
        return this.http.post<ResponseDTO>(`${this.baseUrl}/order/student/all`, {}).pipe(
            tap((res) => {
                this.paidOrders.set(res?.data as OrderResponseDTO[]);
                console.log('Paid orders', res);
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
