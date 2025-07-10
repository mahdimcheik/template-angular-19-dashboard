import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LogoComponent } from '../../../../pages/landing/components/logo/logo.component';
import { LayoutService } from '../../../../layout/service/layout.service';

@Component({
    selector: 'app-auth-layout',
    imports: [CommonModule, RouterModule, LogoComponent],
    templateUrl: './auth-layout.component.html',
    styleUrl: './auth-layout.component.scss'
})
export class AuthLayoutComponent {
    layoutService = inject(LayoutService);
}
