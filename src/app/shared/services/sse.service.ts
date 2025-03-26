import { inject, Injectable, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment.development';

@Injectable({
    providedIn: 'root'
})
export class SSEService {
    baseUrl = environment.BACK_URL;

    private eventSource!: EventSource;
    wizzMessage = signal('');

    constructor() {}

    public subscribeSSE(email: string, token: string) {
        if (email != '' && email != null && email != undefined) {
            this.eventSource = new EventSource(`${this.baseUrl}/sse/${email}/${token}`);

            this.eventSource.onopen = (ev) => {
                console.log('first ', ev);
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
        console.log(ev.data);

        this.wizzMessage.set(this.wizzMessage());

        console.log(this.wizzMessage());
    }
}
