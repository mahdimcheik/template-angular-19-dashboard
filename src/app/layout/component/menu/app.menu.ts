import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../shared/services/auth.service';
import { LayoutService } from '../../service/layout.service';
import { Button, ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule],
    templateUrl: './app.menu.html'
})
export class AppMenu {
    model: MenuItem[] = [];
    router = inject(Router);
    authService = inject(AuthService);
    layoutService = inject(LayoutService);
    isAdmin = computed(() => this.authService.userConnected()?.roles?.includes('Admin'));

    deconnecionItem = {
        label: 'Déconnexion',
        icon: 'pi pi-fw pi-sign-out'
    };
    settingsItem = {
        label: 'Paramètres',
        icon: 'pi pi-cog'
    };

    ngOnInit() {
        if (this.isAdmin()) {
            this.model = [
                { label: 'Tableau de bord', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
                { label: 'Réservations', icon: 'pi pi-fw pi-list', routerLink: ['/reservation/teacher'] },
                { label: 'Calendrier', icon: 'pi pi-fw pi-calendar', routerLink: ['/reservation/calendar-for-teacher'] },
                { label: 'Utilisateurs', icon: 'pi pi-users', routerLink: ['/students-list'] },
                { label: 'Profil', icon: 'pi pi-fw pi-calendar', routerLink: ['/profile'] }
            ];
        } else {
            this.model = [
                { label: 'Tableau de bord', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
                { label: 'Réservations', icon: 'pi pi-fw pi-list', routerLink: ['/reservation/teacher'] },
                { label: 'Calendrier', icon: 'pi pi-fw pi-calendar', routerLink: ['/reservation/calendar-for-student'] },
                { label: 'Mes Commandes', icon: 'pi pi-cart-arrow-down', routerLink: ['/reservation/orders-student'] },
                { label: 'Profil', icon: 'pi pi-fw pi-user', routerLink: ['/profile'] }
            ];
        }
    }

    deconnect() {
        this.authService.logout();
    }
}
