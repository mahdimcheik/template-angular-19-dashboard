import { Component, input } from '@angular/core';
import { NotificationApp } from '../../../../shared/models/notification';
import { CommonModule } from '@angular/common';
import { NotifcationTypePipe } from '../../../../shared/pipes/notifcation-type.pipe';
import { DateIndicatorPipe } from '../../../../shared/pipes/dob-to-age.pipe';

@Component({
    selector: 'app-notifcation',
    imports: [CommonModule, NotifcationTypePipe, DateIndicatorPipe],
    templateUrl: './notifcation.component.html',
    styleUrl: './notifcation.component.scss'
})
export class NotifcationComponent {
    notification = input.required<NotificationApp>();
}
