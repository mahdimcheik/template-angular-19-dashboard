import { Component, computed, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { UserMainService } from '../../../../shared/services/userMain.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'hero-widget',
    imports: [ButtonModule, RippleModule, CommonModule],
    templateUrl: './app.herowidget.html'
})
export class HeroWidget {
    authService = inject(UserMainService);
    isAdmin = computed(() => (this.authService as any).userConnected().roles?.includes('Admin') ?? false);
    router = inject(Router);
    book() {
        if ((this.authService as any).userConnected().email) {
            this.router.navigateByUrl('/dashboard/reservation/calendar-for-student');
        } else {
            this.router.navigateByUrl('/auth/login');
        }
    }
}
