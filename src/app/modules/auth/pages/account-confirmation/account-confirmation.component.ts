import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';

@Component({
    selector: 'app-account-confirmation',
    imports: [FluidModule, ButtonModule],
    templateUrl: './account-confirmation.component.html',
    styleUrl: './account-confirmation.component.scss'
})
export class AccountConfirmationComponent {}
