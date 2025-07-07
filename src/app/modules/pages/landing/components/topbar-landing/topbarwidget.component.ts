import { Component, inject } from '@angular/core';
import { StyleClassModule } from 'primeng/styleclass';
import { Router, RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { LayoutService } from '../../../../../layout/service/layout.service';
import { AuthService } from '../../../../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { LocalstorageService } from '../../../../../shared/services/localstorage.service';

@Component({
    selector: 'topbar-widget',
    imports: [RouterModule, StyleClassModule, ButtonModule, RippleModule, CommonModule],
    templateUrl: './app.topbar-landing.html'
})
export class TopbarWidget {
    layoutService = inject(LayoutService);
    authService = inject(AuthService);
    localStorageService = inject(LocalstorageService);

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
        this.localStorageService.setLayoutConfig(this.layoutService.layoutConfig());
    }
}
