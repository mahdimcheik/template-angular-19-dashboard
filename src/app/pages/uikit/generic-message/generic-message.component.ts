import { Component, input } from '@angular/core';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'generic-message',
    imports: [MessageModule, ToastModule],
    templateUrl: './generic-message.component.html',
    styleUrl: './generic-message.component.scss'
})
export class GenericMessageComponent {
    message = input('');
    severity = input<'error' | 'info' | 'warn' | 'secondary' | 'contrast' | 'success'>('info');
    styleClass = input('mt-2 mb-2');
}
