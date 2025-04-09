import { Component, inject, input, OnInit, signal, viewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { NotifcationComponent } from './notifcation/notifcation.component';
import { CommonModule } from '@angular/common';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
    standalone: true,
    selector: 'app-notifications-widget',
    imports: [ButtonModule, MenuModule, NotifcationComponent, CommonModule, PaginatorModule],
    template: `<div class="card">
        <div class="flex items-center justify-between mb-6">
            <div class="font-semibold text-xl">Notifications</div>
        </div>

        <ul class="p-0 mx-0 mt-0 mb-6 list-none">
            <li>
                <app-notifcation *ngFor="let notif of notifications()" [notification]="notif"></app-notifcation>
            </li>
        </ul>
        <p-paginator [first]="first" [rows]="rows" [totalRecords]="totalRecords()" [rowsPerPageOptions]="[10]" (onPageChange)="loadReservations($event)" #paginator />
    </div>`
})
export class NotificationsWidget implements OnInit {
    notificationService = inject(NotificationService);
    notifications = this.notificationService.notifications;
    totalRecords = this.notificationService.notificationsCount;
    first = 0; // premier element
    rows = 10; // reservations par page
    isRead: boolean | undefined = undefined;
    test = signal(0);

    // paginator ref
    paginator = viewChild<Paginator>('paginator');

    filter = {
        offset: this.first,
        perPage: this.rows,
        isRead: this.isRead
    };

    ngOnInit(): void {
        this.notificationService.getNotificationsByUserId(this.filter).subscribe();
    }

    async loadReservations($event: any) {
        this.filter.offset = $event.first;
        this.filter.perPage = $event.rows;
        this.filter.isRead = this.isRead;

        this.notificationService.getNotificationsByUserId(this.filter).subscribe();
    }
}
