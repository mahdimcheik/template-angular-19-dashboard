import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { GlobalService } from '../../../../shared/services/global.service';
import { LoaderService } from '../../../../shared/services/loader.service';

@Component({
    selector: 'app-overlay-spinner',
    imports: [ProgressSpinnerModule, CommonModule],
    templateUrl: './overlay-spinner.component.html',
    styleUrl: './overlay-spinner.component.scss'
})
export class OverlaySpinnerComponent {
    globalService = inject(GlobalService);
    loaderService = inject(LoaderService);
    isFetching = this.loaderService.isLoading;
}
