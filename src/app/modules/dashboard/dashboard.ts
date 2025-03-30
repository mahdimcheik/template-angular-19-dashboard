import { Component, inject, OnInit } from '@angular/core';
import { NotificationsWidget } from './components/notificationswidget';
import { StatsWidget } from './components/statswidget';
import { NotificationService } from '../../shared/services/notification.service';
import { NotificationApp } from '../../shared/models/notification';

@Component({
    selector: 'app-dashboard',
    imports: [StatsWidget, NotificationsWidget],
    templateUrl: './app.dashboard.html'
})
export class Dashboard implements OnInit {
    offset = 0;
    perPage = 10;
    isread: boolean | undefined = undefined;

    private notificationService = inject(NotificationService);
    notifications: NotificationApp[] = [];

    ngOnInit(): void {
        // const filter = {
        //     isRead: this.isread,
        //     offset: this.offset,
        //     perPage: this.perPage
        // };
        this.notificationService.getNotificationsByUserId({ perPage: 100, offset: 0 }).subscribe((response: any) => {
            console.log(response);
            this.notifications = response.data?.items;
        });
    }
}
