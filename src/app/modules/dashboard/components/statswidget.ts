import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivitiesService } from '../../../api/services/ActivitiesService';
import { WidgetGenericComponent } from './widget-generic.component';
import { ActivitiesTeacher } from '../../../api';

@Component({
    standalone: true,
    selector: 'app-stats-widget',
    imports: [CommonModule, WidgetGenericComponent],
    template: ` <div class="grid grid-cols-12 gap-4  w-full">
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <app-widget-generic title="Réservations aujourd'hui" [middle]="todayReservations()" [icon]="'pi pi-address-book text-[var(--danger-color)] !text-xl'"></app-widget-generic>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <app-widget-generic [title]="'Réservations de la semaine'" [middle]="newReservations()" [icon]="'pi pi-address-book text-primary !text-xl'"></app-widget-generic>
        </div>

        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <app-widget-generic [title]="'Nouveaux élèves'" [middle]="newStudents()" [icon]="'pi pi-user text-primary !text-xl'"></app-widget-generic>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <app-widget-generic [title]="'Commandes de la semaine'" [middle]="newOrders()" [icon]="'pi pi-euro text-primary !text-xl'"></app-widget-generic>
        </div>
    </div>`
})
export class StatsWidget implements OnInit {
    activitiesService = inject(ActivitiesService);
    activities = signal<ActivitiesTeacher>({});
    newStudents = computed<string>(() => (this.activities().newStudents?.length ? `${this.activities().newStudents?.length} nouveaux élèves` : 'Pas de nouveaux élèves'));
    newOrders = computed<string>(() => (this.activities().ordersOfTheWeek?.length ? `${this.activities().ordersOfTheWeek?.length} nouvelles commandes` : 'Pas de nouvelles commandes'));
    newReservations = computed<string>(() => (this.activities().bookingsOftheWeek?.length ? `${this.activities().bookingsOftheWeek?.length} nouvelles réservations` : 'Pas de nouvelles réservations'));
    todayReservations = computed<string>(() =>
        this.activities().bookingsOftheWeek?.filter((booking) => booking.startAt === new Date().toISOString().split('T')[0])?.length
            ? `${this.activities().bookingsOftheWeek?.filter((booking) => booking.startAt === new Date().toISOString().split('T')[0])?.length} réservations aujourd'hui`
            : "Pas de réservations aujourd'hui"
    );
    ngOnInit() {
        this.activitiesService.getApiActivitiesTeacher().subscribe((activities) => {
            this.activities.set(activities?.data ?? {});
            console.log(this.activities());
        });
    }
}
