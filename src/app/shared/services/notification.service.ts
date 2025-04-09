import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { NotificationFilter } from '../models/notification';
import { Observable } from 'rxjs';
import { ResponseDTO } from '../models/user';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private http = inject(HttpClient);

    getNotificationsByUserId(filter: NotificationFilter): Observable<ResponseDTO> {
        return this.http.post<ResponseDTO>(`${environment.BACK_URL}/notifications/user`, filter);
    }

    updateNotification(notificationId: string, newValue: boolean) {
        return this.http.put(`${environment.BACK_URL}/notifications/${notificationId}/${newValue}`, {});
    }
}
