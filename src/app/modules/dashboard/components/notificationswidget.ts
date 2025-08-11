import { Component, inject, input, OnInit, signal, viewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { NotifcationComponent } from './notifcation/notifcation.component';
import { CommonModule } from '@angular/common';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { NotificationMainService } from '../../../shared/services/notificationMain.service';
import { Checkbox } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { NotificationFilter } from '../../../shared/services/notificationMain.service';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
    standalone: true,
    selector: 'app-notifications-widget',
    imports: [ButtonModule, MenuModule, NotifcationComponent, CommonModule, PaginatorModule, FormsModule, RadioButtonModule],
    template: `<div class="card">
        <div class="flex items-center gap-2 mb-6">
            <div class="font-semibold text-xl">Notifications</div>
            <div class="flex items-center">
                <p-radiobutton name="mode" value="all" [(ngModel)]="showMode" inputId="all" (onClick)="onFilterChange($event)" />
                <label for="all" class="ml-2">Toutes</label>
            </div>

            <div class="flex items-center">
                <p-radiobutton name="mode" value="unseen" [(ngModel)]="showMode" inputId="unseen" (onClick)="onFilterChange($event)" />
                <label for="unseen" class="ml-2">Non-lues</label>
            </div>

            <div class="flex items-center">
                <p-radiobutton name="mode" value="seen" [(ngModel)]="showMode" inputId="seen" (onClick)="onFilterChange($event)" />
                <label for="seen" class="ml-2">Lues</label>
            </div>
        </div>

        <ul class="p-0 mx-0 mt-0 mb-6 list-none">
            <li>
                @for (notif of notifications(); track notif.id) {
                    <app-notifcation [notification]="notif"></app-notifcation>
                }
            </li>
        </ul>
        <p-paginator [first]="first" [rows]="rows" [totalRecords]="totalRecords()" [rowsPerPageOptions]="[10]" (onPageChange)="loadReservations($event)" #paginator />
    </div>`
})
export class NotificationsWidget implements OnInit {
    notificationService = inject(NotificationMainService);
    notifications = this.notificationService.notifications;
    totalRecords = this.notificationService.notificationsCount;
    first = 0; // premier element
    rows = 10; // reservations par page

    // filter
    showMode = signal<'all' | 'seen' | 'unseen'>('all');

    // paginator ref
    paginator = viewChild<Paginator>('paginator');

    filter = {
        offset: this.first,
        perPage: this.rows,
        isRead: undefined
    } as NotificationFilter;

    ngOnInit(): void {
        this.showMode.set('all');
        this.notificationService.getNotificationsByUserId(this.filter).subscribe();
    }

    async loadReservations($event: any) {
        this.filter.offset = $event.first;
        this.filter.perPage = $event.rows;

        this.notificationService.getNotificationsByUserId(this.filter).subscribe();
    }

    onFilterChange(event: any) {
        console.log(event);
        // this.showMode.set(event.value);
        if (this.showMode() === 'seen') {
            this.filter.isRead = true;
        } else if (this.showMode() === 'unseen') {
            this.filter.isRead = false;
        } else {
            this.filter.isRead = undefined;
        }

        this.filter.offset = 0;
        this.filter.perPage = this.rows;

        this.first = 0;
        this.rows = 10;

        this.notificationService.getNotificationsByUserId(this.filter).subscribe();
    }
    // onFilterReadOnlyChange(event: any) {
    //     this.showAll = false;
    //     this.filter.isRead = !event.checked;
    //     this.filter.offset = 0;
    //     this.filter.perPage = this.rows;

    //     this.first = 0;
    //     this.rows = 10;

    //     this.notificationService.getNotificationsByUserId(this.filter).subscribe();
    // }
}
