import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CursusListComponent } from '../../components/cursus-list/cursus-list.component';

@Component({
    selector: 'app-cursus-page',
    standalone: true,
    imports: [CommonModule, CursusListComponent],
    templateUrl: './cursus-page.component.html',
    styleUrls: ['./cursus-page.component.scss']
})
export class CursusPageComponent {
    // This component serves as a page wrapper for the cursus list
}
