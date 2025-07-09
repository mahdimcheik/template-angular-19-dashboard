import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { map, Observable, tap } from 'rxjs';
import { Notification, NotificationFilter, NotificationsService } from '../../api';
import { ResponseDTO } from './userMain.service';

@Injectable({
    providedIn: 'root'
})
export class NotificationsMainService {
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

    private http = inject(HttpClient);
    notificationsService = inject(NotificationsService);

    getNotificationsByUserId(filter: NotificationFilter): Observable<ResponseDTO> {
        return this.http.post<ResponseDTO>(`${environment.BACK_URL}/notifications/user`, filter).pipe(
            tap((response) => {
                this.notifications.set(response.data?.items as Notification[]);
                this.notificationsCount.set(response.count ?? 0);
            })
        );
    }

    getNotifcationsCountByUserId(): Observable<number> {
        return this.notificationsService.getNotificationsCount().pipe(
            map((response) => response.data ?? 0),
            tap((count) => {
                this.unseenNotificationsCount.set(count);
            })
        );
    }

    updateNotification(notificationId: string, newValue: boolean, query: NotificationFilter): Observable<ResponseDTO> {
        return this.http.put<ResponseDTO>(`${environment.BACK_URL}/notifications/${notificationId}/${newValue}`, {}).pipe(
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
