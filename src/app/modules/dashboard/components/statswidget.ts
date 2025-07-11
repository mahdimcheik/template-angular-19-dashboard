import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivitiesService } from '../../../api/services/ActivitiesService';
import { WidgetGenericComponent } from './widget-generic.component';
import { ActivitiesStudent, ActivitiesTeacher } from '../../../api';
import { UserMainService } from '../../../shared/services/userMain.service';

@Component({
    standalone: true,
    selector: 'app-stats-widget',
    imports: [CommonModule, WidgetGenericComponent],
    template: `
        <div class="grid grid-cols-12 gap-4  w-full">
            @if (userService.isAdmin()) {
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
            } @else {
                <div class="col-span-12 lg:col-span-6 xl:col-span-3">
                    <app-widget-generic title="Réservations aujourd'hui" [middle]="todayReservationsStudent()" [icon]="'pi pi-address-book text-[var(--danger-color)] !text-xl'"></app-widget-generic>
                </div>
                <div class="col-span-12 lg:col-span-6 xl:col-span-3">
                    <app-widget-generic [title]="'Réservations de la semaine'" [middle]="newReservationsStudent()" [icon]="'pi pi-address-book text-primary !text-xl'"></app-widget-generic>
                </div>

                <div class="col-span-12 lg:col-span-6 xl:col-span-3">
                    <app-widget-generic [title]="'Historique des commandes'" [middle]="ordersHistoryStudent()" [icon]="'pi pi-user text-primary !text-xl'"></app-widget-generic>
                </div>
            }
        </div>
    `
})
export class StatsWidget implements OnInit {
    activitiesService = inject(ActivitiesService);
    userService = inject(UserMainService);
    activities = signal<ActivitiesTeacher>({});
    activitiesStudent = signal<ActivitiesStudent>({});
    newStudents = computed<string>(() => (this.activities().newStudents?.length ? `${this.activities().newStudents?.length} nouveaux élèves` : 'Pas de nouveaux élèves'));
    newOrders = computed<string>(() => (this.activities().ordersOfTheWeek?.length ? `${this.activities().ordersOfTheWeek?.length} nouvelles commandes` : 'Pas de nouvelles commandes'));
    newReservations = computed<string>(() => (this.activities().bookingsOftheWeek?.length ? `${this.activities().bookingsOftheWeek?.length} nouvelles réservations` : 'Pas de nouvelles réservations'));
    todayReservations = computed<string>(() => {
        const todaysReservations = this.activities().bookingsOftheWeek?.filter((booking) => new Date(booking.startAt ?? '') >= new Date() && new Date(booking.startAt ?? '') <= new Date(new Date().setHours(23, 59, 59, 999)))?.length ?? 0;
        return todaysReservations ? `${todaysReservations} réservations aujourd'hui` : "Pas de réservations aujourd'hui";
    });

    // sutdent activities
    newReservationsStudent = computed<string>(() => (this.activitiesStudent().bookingsOftheWeek?.length ? `${this.activitiesStudent().bookingsOftheWeek?.length} nouvelles réservations` : 'Pas de nouvelles réservations'));
    ordersHistoryStudent = computed<string>(() => (this.activitiesStudent().ordersHistory?.length ? `${this.activitiesStudent().ordersHistory?.length} commandes` : 'aucune commande'));
    todayReservationsStudent = computed<string>(() => {
        const todaysReservations = this.activitiesStudent().bookingsOftheWeek?.filter((booking) => new Date(booking.startAt ?? '') >= new Date() && new Date(booking.startAt ?? '') <= new Date(new Date().setHours(23, 59, 59, 999)))?.length ?? 0;
        return todaysReservations ? `${todaysReservations} réservations aujourd'hui` : "Pas de réservations aujourd'hui";
    });

    ngOnInit() {
        if (this.userService.isAdmin()) {
            this.activitiesService.getApiActivitiesTeacher().subscribe((activities) => {
                this.activities.set(activities?.data ?? {});
            });
        } else {
            this.activitiesService.getApiActivitiesStudent(this.userService.userConnected().id ?? '').subscribe((activities) => {
                this.activitiesStudent.set(activities?.data ?? {});
            });
        }
    }
}
