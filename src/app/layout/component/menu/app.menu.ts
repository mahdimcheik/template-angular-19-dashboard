import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { LayoutService } from '../../service/layout.service';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule],
    templateUrl: './app.menu.html'
})
export class AppMenu {
    router = inject(Router);
    authService = inject(AuthService);
    model = this.authService.model;
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

    deconnect() {
        this.authService.logout();
    }
}
