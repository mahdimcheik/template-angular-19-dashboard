import { Component, inject, input } from '@angular/core';
import { Notification } from '../../../../api';
import { CommonModule } from '@angular/common';
import { NotifcationTypePipe } from '../../../../shared/pipes/notifcation-type.pipe';
import { DateIndicatorPipe } from '../../../../shared/pipes/dob-to-age.pipe';
import { ButtonModule } from 'primeng/button';
import { NotificationMainService } from '../../../../shared/services/notificationMain.service';
import { TooltipModule } from 'primeng/tooltip';
import { Router, RouterLink } from '@angular/router';
import { NotificationUrlPipe } from '../../../../shared/pipes/notification-url.pipe';

@Component({
    selector: 'app-notifcation',
    imports: [CommonModule, NotifcationTypePipe, DateIndicatorPipe, ButtonModule, TooltipModule, RouterLink, NotificationUrlPipe],
    templateUrl: './notifcation.component.html',
    styleUrl: './notifcation.component.scss'
})
export class NotifcationComponent {
    notificationService = inject(NotificationMainService);
    router = inject(Router);
    notification = input.required<Notification>();
    initialfilter = {
        offset: 0,
        perPage: 10,
        isRead: undefined
    };

    updateNotificationState(event: Event) {
        event.stopPropagation();
        this.notificationService.updateNotification(this.notification().id!, !this.notification().isRead, this.initialfilter).subscribe();
    }
    onClickNotification(event: Event) {
        event.stopPropagation();
        this.notificationService.updateNotification(this.notification().id!, !this.notification().isRead, this.initialfilter).subscribe();
    }
    onContainerClick(event: Event) {
        event.stopPropagation();
        if (!this.notification().isRead) {
            this.notificationService.updateNotification(this.notification().id!, true, this.initialfilter).subscribe();
        }
        const notificationTypegetter = new NotificationUrlPipe();
        console.log('redirection ', notificationTypegetter.transform(this.notification().type!));

        this.router.navigate([notificationTypegetter.transform(this.notification().type!)]);
    }
}
