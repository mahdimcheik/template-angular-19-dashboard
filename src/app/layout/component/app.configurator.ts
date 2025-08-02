import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SelectButtonModule } from 'primeng/selectbutton';
import { LayoutService } from '../service/layout.service';
import { LocalstorageService } from '../../shared/services/localstorage.service';

@Component({
    selector: 'app-configurator',
    standalone: true,
    imports: [CommonModule, FormsModule, SelectButtonModule],
    template: `
        <div class="flex flex-col gap-4">
            <!-- Dark Mode Toggle -->
            <div class="flex flex-col gap-2 border-2 border-indigo-200 rounded-lg p-4">
                <span class="text-lg text-muted-color font-bold">Mode sombre</span>
                <p-selectbutton [ngModel]="isDarkTheme()" (ngModelChange)="onDarkModeChange($event)" [options]="darkModeOptions" [allowEmpty]="false" size="small" />
            </div>

            <!-- Menu Mode Selection -->
            <div *ngIf="showMenuModeButton()" class="flex flex-col gap-2 border-2 border-indigo-200 rounded-lg p-4">
                <span class="text-lg text-muted-color font-bold">Position du menu latéral</span>
                <p-selectbutton [ngModel]="menuMode()" (ngModelChange)="onMenuModeChange($event)" [options]="menuModeOptions" [allowEmpty]="false" size="small" />
            </div>
        </div>
    `
})
export class AppConfigurator {
    router = inject(Router);
    layoutService: LayoutService = inject(LayoutService);
    localstorageService = inject(LocalstorageService);
    platformId = inject(PLATFORM_ID);

    showMenuModeButton = signal(!this.router.url.includes('auth'));

    darkModeOptions = [
        { label: 'Clair', value: false },
        { label: 'Sombre', value: true }
    ];

    menuModeOptions = [
        { label: 'Static', value: 'static' },
        { label: 'Overlay', value: 'overlay' }
    ];

    isDarkTheme = computed(() => this.layoutService.layoutConfig().darkTheme);
    menuMode = computed(() => this.layoutService.layoutConfig().menuMode);

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            // Initialize dark mode on component load
            this.toggleDarkMode(this.isDarkTheme() ?? false);
        }
    }

    onDarkModeChange(isDark: boolean) {
        this.layoutService.layoutConfig.update((prev) => ({ ...prev, darkTheme: isDark }));
        this.toggleDarkMode(isDark);
        this.localstorageService.setLayoutConfig(this.layoutService.layoutConfig());
    }

    onMenuModeChange(menuMode: string) {
        this.layoutService.layoutConfig.update((prev) => ({ ...prev, menuMode }));
        this.localstorageService.setLayoutConfig(this.layoutService.layoutConfig());
    }

    private toggleDarkMode(isDark: boolean) {
        if (isDark) {
            document.documentElement.classList.add('app-dark');
        } else {
            document.documentElement.classList.remove('app-dark');
        }
    }
}
