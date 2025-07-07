import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { NotificationApp, NotificationFilter } from '../models/notification';
import { Observable, switchMap, tap } from 'rxjs';
import { ResponseDTO } from '../models/user';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    notifications = signal<NotificationApp[]>([] as NotificationApp[]);
    notificationsCount = signal<number>(0);
    private http = inject(HttpClient);

    getNotificationsByUserId(filter: NotificationFilter): Observable<ResponseDTO> {
        return this.http.post<ResponseDTO>(`${environment.BACK_URL}/notifications/user`, filter).pipe(
            tap((response) => {
                this.notifications.set(response.data?.items as NotificationApp[]);
                this.notificationsCount.set(response.count ?? 0);
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
