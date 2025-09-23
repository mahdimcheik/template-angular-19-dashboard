import { computed, inject, Injectable, signal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { NotificationsService as GeneratedNotificationsService } from '../../api/services/NotificationsService';
import { Notification } from '../../api/models/Notification';
import { NotificationFilter } from '../../api/models/NotificationFilter';
import { ResponseDTO } from './userMain.service';

export type { NotificationFilter };
/**
 * Service pour gérer les notifications.
 * Fournit des méthodes pour récupérer, mettre à jour et compter les notifications via l'API.
 * Utilise NotificationsService généré par OpenAPI pour les appels API.
 * Stocke les notifications et leurs comptes dans des signaux pour une réactivité facile dans les composants Angular.
 */
@Injectable({
    providedIn: 'root'
})
export class NotificationMainService {
    private generatedNotificationsService = inject(GeneratedNotificationsService);

    notifications = signal<Notification[]>([] as Notification[]);
    notificationsCount = signal<number>(0);
    unseenNotificationsCount = signal<number>(0);
    unseencomputed = computed(() => {
        if (this.unseenNotificationsCount() > 9) {
            return '9+';
        } else {
            return this.unseenNotificationsCount().toString();
        }
    });

    /**
     * Récupère les notifications d'un utilisateur.
     * @param filter Les critères de filtrage pour récupérer les notifications
     * @returns Un observable contenant la réponse de l'API
     */
    getNotificationsByUserId(filter: NotificationFilter): Observable<ResponseDTO> {
        return this.generatedNotificationsService.postNotificationsUser(filter).pipe(
            map((response) => ({
                message: response.message || 'Success',
                status: response.status || 200,
                data: response.data || { items: [] },
                count: response.count || 0
            })),
            tap((response) => {
                this.notifications.set(response.data?.items as Notification[]);
                this.notificationsCount.set(response.count ?? 0);
            })
        );
    }

    /**
     * Récupère le nombre de notifications non lues.
     * Ce nombre est stocké dans un signal pour une réactivité facile, et qui affiche '9+' si le nombre dépasse 9.
     * @returns Un observable contenant le nombre de notifications non lues
     */
    getNotificationsCount(): Observable<number> {
        return this.generatedNotificationsService.getNotificationsCount().pipe(
            map((response) => response.data ?? 0),
            tap((count) => {
                this.unseenNotificationsCount.set(count);
            })
        );
    }

    /**
     * Met à jour une notification.
     * @param notificationId ID de la notification à mettre à jour
     * @param newValue Nouvelle valeur pour la notification (par exemple, marquer comme lue)
     * @param query Critères de filtrage pour la notification
     * @returns Un observable contenant la réponse de l'API
     */
    updateNotification(notificationId: string, newValue: boolean, query: NotificationFilter): Observable<ResponseDTO> {
        return this.generatedNotificationsService.putNotifications(notificationId, newValue).pipe(
            map((response) => ({
                message: response.message || 'Success',
                status: response.status || 200,
                data: response.data || {},
                count: response.count || 0
            })),
            tap((res) => {
                this.notifications.update((notifs) => {
                    const index = notifs.findIndex((notif) => notif.id === notificationId);
                    if (index !== -1) {
                        notifs[index].isRead = newValue;
                    }
                    return notifs;
                });
            })
        );
    }
}
