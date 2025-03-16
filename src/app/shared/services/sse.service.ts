import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SSEService {
    private sseEndpoint = 'https://localhost:7113/sse';
    private eventSource!: EventSource;
    wizzMessage = signal('');

    constructor() {}

    public subscribe(userId: string) {
        this.eventSource = new EventSource(`https://localhost:7113/sse/${userId}`);

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

    public onMessageRecieved(ev: MessageEvent<any>) {
        console.log(ev.data);

        this.wizzMessage.set(this.wizzMessage());

        console.log(this.wizzMessage());
    }
}
