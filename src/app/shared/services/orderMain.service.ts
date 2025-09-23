import { inject, Injectable, signal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { OrderService as GeneratedOrderService } from '../../api/services/OrderService';
import { BillService as GeneratedBillService } from '../../api/services/BillService';
import { OrderResponseForStudentDTO } from '../../api/models/OrderResponseForStudentDTO';
import { OrderPagination as GeneratedOrderPagination } from '../../api/models/OrderPagination';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { ResponseDTO } from './userMain.service';
import { environment } from '../../../environments/environment';
/**
 * Type aliases  pour la compatibilité ascendante.
 */
export type OrderResponseDTO = OrderResponseForStudentDTO;
export type OrderPagination = GeneratedOrderPagination;

/**
 * Service pour gérer les commandes.
 * Fournit des méthodes pour récupérer les commandes actuelles, les commandes payées et pour obtenir une facture via l'API.
 * Utilise OrderService et BillService générés par OpenAPI pour les appels API.
 * Stocke la commande actuelle, les commandes payées et leur nombre dans des signaux pour une réactivité facile dans les composants Angular.
 */
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

    /**
     * Récupère la commande actuelle de l'utilisateur connecté.
     * @note Il n'y a qu'une seule commande actuelle possible par utilisateur.
     * @returns Un observable contenant la commande actuelle de l'utilisateur connecté
     */
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

    /**
     * Récupère les commandes payées de l'utilisateur connecté.
     * @param filter Les critères de filtrage pour récupérer les commandes payées (pagination, etc.)
     * @returns Un observable contenant les commandes payées de l'utilisateur connecté
     */
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

    /**
     * Récupère la facture d'une commande.
     * @param orderId ID de la commande pour laquelle on veut la facture
     * @returns Un observable contenant la facture au format Blob
     */
    getBill(orderId: string): Observable<Blob> {
        return this.http.get(`${environment.BACK_URL}/bill/export?orderId=${orderId}`, { responseType: 'blob' }).pipe(
            tap((blob) => {
                const url = window.URL.createObjectURL(blob as Blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'facture.pdf';
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
