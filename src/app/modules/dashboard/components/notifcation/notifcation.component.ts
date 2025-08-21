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
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-notifcation',
    imports: [CommonModule, NotifcationTypePipe, DateIndicatorPipe, ButtonModule, TooltipModule],
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

    async updateNotificationState(event: Event) {
        event.stopPropagation();
        try {
            await firstValueFrom(this.notificationService.updateNotification(this.notification().id!, !this.notification().isRead, this.initialfilter));
            await firstValueFrom(this.notificationService.getNotificationsCount());
        } catch (error) {
            console.error('Error updating notification:', error);
        }
    }

    async onContainerClick(event: Event) {
        event.stopPropagation();
        if (!this.notification().isRead) {
            try {
                await firstValueFrom(this.notificationService.updateNotification(this.notification().id!, true, this.initialfilter));
                await firstValueFrom(this.notificationService.getNotificationsCount());
            } catch (error) {
                console.error('Error updating notification:', error);
            }
        }
        const notificationTypegetter = new NotificationUrlPipe();

        this.router.navigate([notificationTypegetter.transform(this.notification().type!)], {
            queryParams: { reservationId: this.notification().bookingId }
        });
    }
}
