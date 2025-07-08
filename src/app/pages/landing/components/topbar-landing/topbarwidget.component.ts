import { Component, inject } from '@angular/core';
import { StyleClassModule } from 'primeng/styleclass';
import { Router, RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { LayoutService } from '../../../../layout/service/layout.service';
import { UserMainService } from '../../../../shared/services/userMain.service';
import { CommonModule } from '@angular/common';
import { LocalstorageService } from '../../../../shared/services/localstorage.service';
import { AvatarModule } from 'primeng/avatar';

@Component({
    selector: 'topbar-widget',
    imports: [RouterModule, StyleClassModule, ButtonModule, RippleModule, CommonModule, AvatarModule],
    templateUrl: './app.topbar-landing.html'
})
export class TopbarWidget {
    layoutService = inject(LayoutService);
    authService = inject(UserMainService);
    localStorageService = inject(LocalstorageService);

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
        this.localStorageService.setLayoutConfig(this.layoutService.layoutConfig());
    }
}
