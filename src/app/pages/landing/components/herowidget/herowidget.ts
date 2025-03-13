import { Component, computed, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '../../../../shared/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'hero-widget',
    imports: [ButtonModule, RippleModule, CommonModule],
    templateUrl: './app.herowidget.html'
})
export class HeroWidget {
    authService = inject(AuthService);
    isAdmin = computed(() => this.authService.userConnected().roles?.includes('Admin') ?? false);
    router = inject(Router);
    book() {
        if (this.authService.userConnected().email) {
            this.router.navigateByUrl('/reservation/calendar-for-student');
        } else {
            this.router.navigateByUrl('/auth/login');
        }
    }
}
