import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';

@Component({
    selector: 'app-password-reset-successfully',
    imports: [FluidModule, ButtonModule],
    templateUrl: './password-reset-successfully.component.html',
    styleUrl: './password-reset-successfully.component.scss'
})
export class PasswordResetSuccessfullyComponent {}
