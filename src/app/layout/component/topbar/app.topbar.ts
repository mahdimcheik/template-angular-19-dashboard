import { Component, computed, inject, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from '../app.configurator';
import { LayoutService } from '../../service/layout.service';
import { AuthService } from '../../../shared/services/auth.service';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator, AvatarModule, MenuModule, MenubarModule],
    templateUrl: './app.topbar.html'
})
export class AppTopbar {
    items!: MenuItem[];
    authService = inject(AuthService);
    router = inject(Router);
    user = this.authService.userConnected;

    userItems = computed(() => {
        if (this.user().email) {
            return [
                {
                    label: `${this.user().firstName} ${this.user().lastName}`,
                    icon: 'pi pi-user',
                    command: () => this.router.navigateByUrl('profile/me')
                },
                {
                    label: 'Déconnexion',
                    icon: 'pi pi-star',
                    command: () => this.authService.logout()
                }
            ];
        } else {
            return [
                {
                    label: 'Connexion',
                    icon: 'pi pi-home',
                    command: () => this.router.navigateByUrl('auth/login')
                },
                {
                    label: 'Inscription',
                    icon: 'pi pi-star',
                    command: () => this.router.navigateByUrl('auth/inscription')
                }
            ];
        }
    });

    constructor(public layoutService: LayoutService) {}

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }
}
