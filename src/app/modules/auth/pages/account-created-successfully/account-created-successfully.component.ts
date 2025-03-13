import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';

@Component({
    selector: 'app-account-created-successfully',
    imports: [FluidModule, ButtonModule],
    templateUrl: './account-created-successfully.component.html',
    styleUrl: './account-created-successfully.component.scss'
})
export class AccountCreatedSuccessfullyComponent {}
