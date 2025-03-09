import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { LocalstorageService } from './app/shared/services/localstorage.service';
import { AuthService } from './app/shared/services/auth.service';
import { catchError, of, switchMap } from 'rxjs';
import { OrderService } from './app/shared/services/order.service';
import { LayoutService } from './app/layout/service/layout.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, ToastModule],
    providers: [MessageService],
    template: `
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
        try {
            this.authService
                .getprofile()
                .pipe(
                    switchMap((res) => {
                        return this.orderService.getCurrentOrder();
                    }),
                    catchError((error) => {
                        console.log(error);
                        return of();
                    })
                )
                .subscribe();
        } catch (error) {
            console.log(error);
        }

        // try {
        //     const layoutconfig = this.localStorageService.getLayoutConfig();
        //     if (layoutconfig) {
        //         this.layoutService.layoutConfig.update((state) => ({ ...state, ...layoutconfig }));
        //     }
        // } catch (error) {}
    }
}
