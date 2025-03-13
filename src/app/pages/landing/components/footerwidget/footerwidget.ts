import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LayoutService } from '../../../../layout/service/layout.service';

@Component({
    selector: 'footer-widget',
    imports: [RouterModule],
    templateUrl: './app.footerwidget.html'
})
export class FooterWidget {
    layoutService = inject(LayoutService);
    constructor(public router: Router) {}
}
