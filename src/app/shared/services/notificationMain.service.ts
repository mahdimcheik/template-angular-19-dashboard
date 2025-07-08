import { inject, Injectable, signal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { ResponseDTO } from '../models/user';
import { NotificationsService as GeneratedNotificationsService } from '../../api/services/NotificationsService';
import { Notification } from '../../api/models/Notification';
import { NotificationFilter } from '../../api/models/NotificationFilter';

export type { NotificationFilter };

@Injectable({
    providedIn: 'root'
})
export class NotificationMainService {
    private generatedNotificationsService = inject(GeneratedNotificationsService);

    notifications = signal<Notification[]>([] as Notification[]);
    notificationsCount = signal<number>(0);

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
