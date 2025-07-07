import { Component, inject, input, OnInit, signal, viewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { NotifcationComponent } from './notifcation/notifcation.component';
import { CommonModule } from '@angular/common';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { NotificationService } from '../../../shared/services/notification.service';
import { Checkbox, CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { QueryPanigation } from '../../../shared/models/slot';
import { NotificationFilter } from '../../../shared/models/notification';
import { catchError, of } from 'rxjs';

@Component({
    standalone: true,
    selector: 'app-notifications-widget',
    imports: [ButtonModule, MenuModule, NotifcationComponent, CommonModule, PaginatorModule, Checkbox, FormsModule],
    template: `<div class="card">
        <div class="flex items-center gap-2 mb-6">
            <div class="font-semibold text-xl">Notifications</div>
            <div class="flex items-center gap-2">
                <p-checkbox inputId="all" [(ngModel)]="showAll" [binary]="true" (onChange)="onFilterAllChange($event)" />
                <label for="all"> Toutes </label>
            </div>
            <div class="flex items-center gap-2">
                <p-checkbox inputId="read" [(ngModel)]="readOnly" [binary]="true" (onChange)="onFilterReadOnlyChange($event)" />
                <label for="read"> Non-lues uniquement? </label>
            </div>
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

    // filter
    readOnly!: boolean;
    showAll!: boolean;

    // paginator ref
    paginator = viewChild<Paginator>('paginator');

    filter = {
        offset: this.first,
        perPage: this.rows,
        isRead: undefined
    } as NotificationFilter;

    ngOnInit(): void {
        this.readOnly = false;
        this.showAll = true;
        this.notificationService.getNotificationsByUserId(this.filter).subscribe();
    }

    async loadReservations($event: any) {
        this.filter.offset = $event.first;
        this.filter.perPage = $event.rows;

        this.notificationService.getNotificationsByUserId(this.filter).subscribe();
    }

    onFilterAllChange(event: any) {
        if (this.showAll) {
            this.readOnly = false;
        }
        this.filter.isRead = !this.showAll ? !this.showAll : undefined;

        this.filter.offset = 0;
        this.filter.perPage = this.rows;

        this.first = 0;
        this.rows = 10;

        this.notificationService.getNotificationsByUserId(this.filter).subscribe();
    }
    onFilterReadOnlyChange(event: any) {
        this.showAll = false;
        this.filter.isRead = !event.checked;
        this.filter.offset = 0;
        this.filter.perPage = this.rows;

        this.first = 0;
        this.rows = 10;

        this.notificationService.getNotificationsByUserId(this.filter).subscribe();
    }
}
