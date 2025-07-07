import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../../../../layout/service/layout.service';

@Component({
    selector: 'features-widget',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './app.featureswidget.html'
})
export class FeaturesWidget {
    layoutService = inject(LayoutService);
}
