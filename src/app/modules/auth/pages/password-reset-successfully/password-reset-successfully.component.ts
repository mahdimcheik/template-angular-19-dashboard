import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';

@Component({
    selector: 'app-password-reset-successfully',
    imports: [FluidModule, ButtonModule],
    templateUrl: './password-reset-successfully.component.html',
    styleUrl: './password-reset-successfully.component.scss'
})
export class PasswordResetSuccessfullyComponent {
    router = inject(Router);

    goToLogin() {
        this.router.navigate(['/auth/login']);
    }
}
