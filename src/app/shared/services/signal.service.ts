// src/app/services/chat.service.ts
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SignalService {
    private hubConnection!: signalR.HubConnection;
    private messagesSubject = new BehaviorSubject<{ user: string; message: string }[]>([]);
    messages$ = this.messagesSubject.asObservable();

    constructor() {}

    startConnection(token: string) {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${environment.BACK_URL}/signalhub`, {
                accessTokenFactory: () => token
                // transport: signalR.HttpTransportType.WebSockets,
            })
            .withAutomaticReconnect()
            .build();

        this.hubConnection.start().catch((err) => console.error('Error while starting connection: ' + err));

        this.hubConnection.on('ReceiveMessage', (user: string, message: string) => {
            console.log('ReceiveMessage', user, message);

            this.hubConnection.onreconnecting((error) => {
                console.log('Reconnecting...', error);
            });
            this.hubConnection.onreconnected((connectionId) => {
                console.log('Reconnected with connectionId: ' + connectionId);
            });

            const current = this.messagesSubject.value;
            this.messagesSubject.next([...current, { user, message }]);
            this.getOnlineCount();
        });
    }

    stopConnection() {
        this.hubConnection.stop();
    }

    sendMessage(user: string, message: string) {
        if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
            this.hubConnection.invoke('SendMessage', user, message).catch((err) => console.error(err));
        } else {
            console.log('Connection not established');
        }
    }

    getOnlineCount() {
        this.hubConnection.invoke('GetOnlineCount').then((count) => {
            console.log('Clients connectés :', count);
        });
    }
}
