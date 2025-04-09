import { Component, inject, input } from '@angular/core';
import { NotificationApp } from '../../../../shared/models/notification';
import { CommonModule } from '@angular/common';
import { NotifcationTypePipe } from '../../../../shared/pipes/notifcation-type.pipe';
import { DateIndicatorPipe } from '../../../../shared/pipes/dob-to-age.pipe';
import { ButtonModule } from 'primeng/button';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
    selector: 'app-notifcation',
    imports: [CommonModule, NotifcationTypePipe, DateIndicatorPipe, ButtonModule],
    templateUrl: './notifcation.component.html',
    styleUrl: './notifcation.component.scss'
})
export class NotifcationComponent {
    notificationService = inject(NotificationService);
    notification = input.required<NotificationApp>();
    initialfilter = {
        offset: 0,
        perPage: 10,
        isRead: undefined
    };

    updateNotificationState(event: Event) {
        event.stopPropagation();
        this.notificationService.updateNotification(this.notification().id, !this.notification().isRead, this.initialfilter).subscribe();
    }
}
