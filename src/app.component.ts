import { Component, inject, OnInit } from '@angular/core';
import { NavigationStart, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { LocalstorageService } from './app/shared/services/localstorage.service';
import { UserMainService } from './app/shared/services/userMain.service';
import { catchError, of, switchMap } from 'rxjs';
import { OrderMainService } from './app/shared/services/orderMain.service';
import { LayoutService } from './app/layout/service/layout.service';
import { AppConfigurator } from './app/layout/component/app.configurator';
import { ConnectionService } from './app/shared/services/connection.service';
import { ProgressBarModule } from 'primeng/progressbar';
import { CommonModule } from '@angular/common';
import { OverlaySpinnerComponent } from './app/pages/landing/components/overlay-spinner/overlay-spinner.component';
import { CookieConsentBannerComponent } from './app/shared/components/cookie-consent-banner/cookie-consent-banner.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, ToastModule, AppConfigurator, ProgressBarModule, CommonModule, OverlaySpinnerComponent, CookieConsentBannerComponent],
    template: `
        <div class="hidden">
            <app-configurator></app-configurator>
        </div>
        <app-overlay-spinner></app-overlay-spinner>
        <div>
            <p-progressbar *ngIf="!connectionService.isOnline()" [style]="{ height: '25px' }" value="100" [showValue]="true" color="red">
                <ng-template #content let-value>
                    <div class="flex flex-row items-center gap-4">
                        <span>Vous êtes hors ligne </span>
                    </div>
                </ng-template>
            </p-progressbar>
        </div>
        <p-toast></p-toast>
        <router-outlet></router-outlet>
        <app-cookie-consent-banner></app-cookie-consent-banner>
    `
})
export class AppComponent implements OnInit {
    localStorageService = inject(LocalstorageService);
    authService = inject(UserMainService);
    orderService = inject(OrderMainService);
    layoutService = inject(LayoutService);
    router = inject(Router);
    connectionService = inject(ConnectionService);

    ngOnInit(): void {
        this.connectionService.checkNetworkStatus();
        (this.authService as any)
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
