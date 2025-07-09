import { Component, computed, inject, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from '../app.configurator';
import { LayoutService } from '../../service/layout.service';
import { UserMainService } from '../../../shared/services/userMain.service';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { OrderMainService } from '../../../shared/services/orderMain.service';
import { LocalstorageService } from '../../../shared/services/localstorage.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AvatarModule, MenuModule, MenubarModule, TagModule, BadgeModule],
    templateUrl: './app.topbar.html'
})
export class AppTopbar {
    items!: MenuItem[];
    authService = inject(UserMainService);
    orderService = inject(OrderMainService);
    layoutService = inject(LayoutService);
    currentOrder = this.orderService.currentOrder;
    numberBooking = computed(() => {
        if (!this.currentOrder().bookings || this.currentOrder().bookings?.length == 0) return '';
        return '' + this.currentOrder().bookings?.length;
    });
    router = inject(Router);
    user = (this.authService as any).userConnected;
    isAdmin = computed(() => this.user().roles?.includes('Admin') ?? false);
    localStorageService = inject(LocalstorageService);

    userItems = computed(() => {
        if (this.user().email) {
            return [
                {
                    label: `${this.user().firstName} ${this.user().lastName}`,
                    icon: 'pi pi-user',
                    command: () => this.router.navigate(['profile'])
                },
                {
                    label: 'Déconnexion',
                    icon: 'pi pi-star',
                    command: () => (this.authService as any).logout()
                }
            ];
        } else {
            return [
                {
                    label: 'Connexion',
                    icon: 'pi pi-home',
                    command: () => this.router.navigate(['auth/login'])
                },
                {
                    label: 'Inscription',
                    icon: 'pi pi-star',
                    command: () => this.router.navigate(['auth/inscription'])
                }
            ];
        }
    });

    calendarLink = computed(() => {
        if (this.user().email) {
            if (this.user()?.roles) {
                if (this.user()?.roles.includes('Admin')) {
                    return '/dashboard/reservation/calendar-for-teacher';
                } else {
                    return '/dashboard/reservation/calendar-for-student';
                }
            }
            return '/dashboard/reservation/calendar-for-student';
        }
        return '';
    });

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
        this.localStorageService.setLayoutConfig(this.layoutService.layoutConfig());
    }
}
