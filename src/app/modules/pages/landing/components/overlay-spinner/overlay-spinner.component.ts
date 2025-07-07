import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoaderService } from '../../../../../shared/services/loader.service';

@Component({
    selector: 'app-overlay-spinner',
    imports: [ProgressSpinnerModule, CommonModule],
    templateUrl: './overlay-spinner.component.html',
    styleUrl: './overlay-spinner.component.scss'
})
export class OverlaySpinnerComponent {
    loaderService = inject(LoaderService);
    isFetching = this.loaderService.isLoading;
}
