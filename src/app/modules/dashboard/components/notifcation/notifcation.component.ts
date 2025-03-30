import { Component, input } from '@angular/core';
import { NotificationApp } from '../../../../shared/models/notification';
import { CommonModule } from '@angular/common';
import { NotifcationTypePipe } from '../../../../shared/pipes/notifcation-type.pipe';

@Component({
    selector: 'app-notifcation',
    imports: [CommonModule, NotifcationTypePipe],
    templateUrl: './notifcation.component.html',
    styleUrl: './notifcation.component.scss'
})
export class NotifcationComponent {
    notification = input.required<NotificationApp>();
}
