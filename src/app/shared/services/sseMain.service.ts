import { inject, Injectable, signal } from '@angular/core';
import { SseService as GeneratedSseService } from '../../api/services/SseService';
import { environment } from '../../../environments/environment.development';

@Injectable({
    providedIn: 'root'
})
export class SSEMainService {
    private generatedSseService = inject(GeneratedSseService);
    baseUrl = environment.BACK_URL;

    private eventSource!: EventSource;
    wizzMessage = signal('');

    public subscribeSSE(email: string, token: string) {
        if (email != '' && email != null && email != undefined) {
            this.eventSource = new EventSource(`${this.baseUrl}/sse/${email}/${token}`);

            this.eventSource.onopen = (ev) => {
                this.wizzMessage.set('opened');
            };
            this.eventSource.onerror = (ev) => {
                console.log(ev);
                return null;
            };
            this.eventSource.onmessage = (ev) => this.onMessageRecieved(ev);
        }
    }

    public onMessageRecieved(ev: MessageEvent<any>) {
        this.wizzMessage.set(this.wizzMessage());
    }

    // Additional methods using the generated service
    public notifyUser(email: string, message: string) {
        return this.generatedSseService.postSseNotify(email, message);
    }

    public notifyAll(message: string) {
        return this.generatedSseService.postSseNotifyall(message);
    }
}
