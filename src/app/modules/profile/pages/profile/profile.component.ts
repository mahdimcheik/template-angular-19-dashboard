import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-profile',
    standalone: false,

    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss'
})
export class ProfileComponent {
    items: MenuItem[] = [
        {
            label: 'Save',
            icon: 'pi pi-check'
        },
        {
            label: 'Update',
            icon: 'pi pi-upload'
        },
        {
            label: 'Delete',
            icon: 'pi pi-trash'
        },
        {
            label: 'Home Page',
            icon: 'pi pi-home'
        }
    ];
}
