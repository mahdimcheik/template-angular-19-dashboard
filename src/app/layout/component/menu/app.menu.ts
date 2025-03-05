import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './app.menu.html'
})
export class AppMenu {
    model: MenuItem[] = [];
    router = inject(Router);
    authService = inject(AuthService);

    deconnecionItem = {
        label: 'Déconnexion',
        icon: 'pi pi-fw pi-sign-out'
    };

    ngOnInit() {
        this.model = [
            { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] },

            { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
            { label: 'Réservations', icon: 'pi pi-fw pi-list', routerLink: ['/reservation/teacher'] },
            { label: 'Input', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/input'] },
            { label: 'Button', icon: 'pi pi-fw pi-mobile', class: 'rotated-icon', routerLink: ['/uikit/button'] },
            { label: 'Table', icon: 'pi pi-fw pi-table', routerLink: ['/uikit/table'] },
            { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/uikit/list'] }
            // { label: 'Tree', icon: 'pi pi-fw pi-share-alt', routerLink: ['/uikit/tree'] },
            // { label: 'Panel', icon: 'pi pi-fw pi-tablet', routerLink: ['/uikit/panel'] },
            // { label: 'Overlay', icon: 'pi pi-fw pi-clone', routerLink: ['/uikit/overlay'] },
            // { label: 'Media', icon: 'pi pi-fw pi-image', routerLink: ['/uikit/media'] },
            // { label: 'Menu', icon: 'pi pi-fw pi-bars', routerLink: ['/uikit/menu'] },
            // { label: 'Message', icon: 'pi pi-fw pi-comment', routerLink: ['/uikit/message'] },
            // { label: 'File', icon: 'pi pi-fw pi-file', routerLink: ['/uikit/file'] },
            // { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/charts'] },
            // { label: 'Timeline', icon: 'pi pi-fw pi-calendar', routerLink: ['/uikit/timeline'] },
            // { label: 'Misc', icon: 'pi pi-fw pi-circle', routerLink: ['/uikit/misc'] },

            // {
            //     label: 'Login',
            //     icon: 'pi pi-fw pi-sign-in',
            //     routerLink: ['/auth/login']
            // },
            // {
            //     label: 'Error',
            //     icon: 'pi pi-fw pi-times-circle',
            //     routerLink: ['/auth/error']
            // },
            // {
            //     label: 'Access Denied',
            //     icon: 'pi pi-fw pi-lock',
            //     routerLink: ['/auth/access']
            // },
            // {
            //     label: 'Crud',
            //     icon: 'pi pi-fw pi-pencil',
            //     routerLink: ['/pages/crud']
            // },
            // {
            //     label: 'Not Found',
            //     icon: 'pi pi-fw pi-exclamation-circle',
            //     routerLink: ['/pages/notfound']
            // },
            // {
            //     label: 'Empty',
            //     icon: 'pi pi-fw pi-circle-off',
            //     routerLink: ['/pages/empty']
            // }
        ];
    }

    deconnect() {
        this.authService.logout();
    }
}
