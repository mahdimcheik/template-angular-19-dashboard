import { Component, inject, input } from '@angular/core';
import { Notification } from '../../../../api';
import { CommonModule } from '@angular/common';
import { NotifcationTypePipe } from '../../../../shared/pipes/notifcation-type.pipe';
import { DateIndicatorPipe } from '../../../../shared/pipes/dob-to-age.pipe';
import { ButtonModule } from 'primeng/button';
import { NotificationMainService } from '../../../../shared/services/notificationMain.service';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-notifcation',
    imports: [CommonModule, NotifcationTypePipe, DateIndicatorPipe, ButtonModule, TooltipModule],
    templateUrl: './notifcation.component.html',
    styleUrl: './notifcation.component.scss'
})
export class NotifcationComponent {
    notificationService = inject(NotificationMainService);
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
}
