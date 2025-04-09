import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { NotifcationComponent } from './notifcation/notifcation.component';
import { CommonModule } from '@angular/common';
import { NotificationApp } from '../../../shared/models/notification';
import { PaginatorModule } from 'primeng/paginator';
import { NotificationService } from '../../../shared/services/notification.service';
import { QueryPanigation } from '../../../shared/models/slot';
import { ResponseDTO } from '../../../shared/models/user';

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
        <p-paginator [first]="0" [rows]="10" [totalRecords]="10" [rowsPerPageOptions]="[10]" />

        <!-- <span class="block text-muted-color font-medium mb-4">Aujourd'hui</span>
        <ul class="p-0 mx-0 mt-0 mb-6 list-none">
            <li class="flex items-center py-2 border-b border-surface">
                <div class="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-full mr-4 shrink-0">
                    <i class="pi pi-euro !text-xl text-green-500"></i>
                </div>
                <span class="text-surface-900 dark:text-surface-0 leading-normal"
                    >Mahdi Mcheik
                    <span class="text-surface-700 dark:text-surface-100">a réservé un créneaux <span class="text-primary font-bold">100.00 €</span></span>
                </span>
            </li>
            <li class="flex items-center py-2">
                <div class="w-12 h-12 flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-full mr-4 shrink-0">
                    <i class="pi pi-undo !text-xl text-orange-500"></i>
                </div>
                <span class="text-surface-900 dark:text-surface-0 leading-normal"
                    >Nassime harmach
                    <span class="text-surface-700 dark:text-surface-100">a annulé une réservation prévue le <span class="text-primary font-bold">15 mars</span></span>
                </span>
            </li>
        </ul> -->

        <!-- <span class="block text-muted-color font-medium mb-4">Hier</span>
        <ul class="p-0 mx-0 mt-0 mb-6 list-none">
            <li class="flex items-center py-2 border-b border-surface">
                <div class="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-full mr-4 shrink-0">
                    <i class="pi pi-euro !text-xl text-green-500"></i>
                </div>
                <span class="text-surface-900 dark:text-surface-0 leading-normal"
                    >Mahdi Mcheik
                    <span class="text-surface-700 dark:text-surface-100">a réservé un créneaux <span class="text-primary font-bold">100.00 €</span></span>
                </span>
            </li>
            <li class="flex items-center py-2">
                <div class="w-12 h-12 flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-full mr-4 shrink-0">
                    <i class="pi pi-undo !text-xl text-orange-500"></i>
                </div>
                <span class="text-surface-900 dark:text-surface-0 leading-normal"
                    >Nassime harmach
                    <span class="text-surface-700 dark:text-surface-100">a annulé une réservation prévue le <span class="text-primary font-bold">15 mars</span></span>
                </span>
            </li>
        </ul>
        <span class="block text-muted-color font-medium mb-4">Ce mois-ci</span>
        <ul class="p-0 mx-0 mt-0 mb-6 list-none">
            <li class="flex items-center py-2 border-b border-surface">
                <div class="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-full mr-4 shrink-0">
                    <i class="pi pi-euro !text-xl text-green-500"></i>
                </div>
                <span class="text-surface-900 dark:text-surface-0 leading-normal"
                    >Mahdi Mcheik
                    <span class="text-surface-700 dark:text-surface-100">a réservé un créneaux <span class="text-primary font-bold">100.00 €</span></span>
                </span>
            </li>
            <li class="flex items-center py-2">
                <div class="w-12 h-12 flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-full mr-4 shrink-0">
                    <i class="pi pi-undo !text-xl text-orange-500"></i>
                </div>
                <span class="text-surface-900 dark:text-surface-0 leading-normal"
                    >Nassime harmach
                    <span class="text-surface-700 dark:text-surface-100">a annulé une réservation prévue le <span class="text-primary font-bold">15 mars</span></span>
                </span>
            </li>
            <li class="flex items-center py-2">
                <div class="w-12 h-12 flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-full mr-4 shrink-0">
                    <i class="pi pi-undo !text-xl text-orange-500"></i>
                </div>
                <span class="text-surface-900 dark:text-surface-0 leading-normal"
                    >Nassime harmach
                    <span class="text-surface-700 dark:text-surface-100">a annulé une réservation prévue le <span class="text-primary font-bold">15 mars</span></span>
                </span>
            </li>
            <li class="flex items-center py-2">
                <div class="w-12 h-12 flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-full mr-4 shrink-0">
                    <i class="pi pi-undo !text-xl text-orange-500"></i>
                </div>
                <span class="text-surface-900 dark:text-surface-0 leading-normal"
                    >Nassime harmach
                    <span class="text-surface-700 dark:text-surface-100">a annulé une réservation prévue le <span class="text-primary font-bold">15 mars</span></span>
                </span>
            </li>
        </ul> -->
    </div>`
})
export class NotificationsWidget implements OnInit {
    notificationService = inject(NotificationService);
    notifications = signal<NotificationApp[]>([] as NotificationApp[]);
    first = 0; // premier element
    rows = 10; // reservations par page
    filter = {
        offset: this.first,
        perPage: this.rows
    };

    ngOnInit(): void {
        this.notificationService.getNotificationsByUserId(this.filter).subscribe((response: ResponseDTO) => {
            this.notifications.set(response.data?.items);
            // console.log("response", response.data?.items);
            console.log('notifications', this.notifications());
        });
    }

    async loadReservations($event: any) {
        this.filter.offset = $event.first;
        this.filter.perPage = $event.rows;

        console.log('query ', this.filter, $event);
        this.notificationService.getNotificationsByUserId(this.filter).subscribe((res) => {
            this.notifications = res.data?.items;
        });
    }
}
