import { Component, inject, OnInit } from '@angular/core';
import { NotificationsWidget } from './components/notificationswidget';
import { StatsWidget } from './components/statswidget';
import { NotificationService } from '../../shared/services/notification.service';

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

    ngOnInit(): void {
        // const filter = {
        //     isRead: this.isread,
        //     offset: this.offset,
        //     perPage: this.perPage
        // };
        this.notificationService.getNotificationsByUserId({ perPage: 10, offset: 0 }).subscribe((response: any) => {
            console.log(response);
        });
    }
}
