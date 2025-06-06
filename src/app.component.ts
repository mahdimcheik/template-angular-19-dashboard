import { Component, inject, OnInit } from '@angular/core';
import { NavigationStart, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { LocalstorageService } from './app/shared/services/localstorage.service';
import { AuthService } from './app/shared/services/auth.service';
import { catchError, of, switchMap } from 'rxjs';
import { OrderService } from './app/shared/services/order.service';
import { LayoutService } from './app/layout/service/layout.service';
import { AppConfigurator } from './app/layout/component/app.configurator';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, ToastModule, AppConfigurator],
    template: `
        <div class="hidden">
            <app-configurator></app-configurator>
        </div>
        <p-toast></p-toast>
        <router-outlet></router-outlet>
    `
})
export class AppComponent implements OnInit {
    localStorageService = inject(LocalstorageService);
    authService = inject(AuthService);
    orderService = inject(OrderService);
    layoutService = inject(LayoutService);
    router = inject(Router);

    ngOnInit(): void {
        this.authService
            .getprofile()
            .pipe(
                switchMap((res) => {
                    return this.orderService.getCurrentOrder();
                }),
                catchError((error) => {
                    return of();
                })
            )
            .subscribe();
    }
}
