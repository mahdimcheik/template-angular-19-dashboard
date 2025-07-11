// src/app/services/signalr.service.ts
import { inject, Injectable, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { MessageService } from 'primeng/api';
import { environment } from '../../../environments/environment';

export interface NotificationEvent {
    type: 'notificationIndividual' | 'notificationGroup';
    data: any;
}

@Injectable({
    providedIn: 'root'
})
export class SignalRService {
    private hubConnection!: signalR.HubConnection;
    private readonly toastrService = inject(MessageService);

    // Pour interaction avec le composant notifications-list
    public notificationEventSignal = signal<NotificationEvent | null>(null);

    constructor() {}

    public startConnection = (token?: string, groupName: string | null = null) => {
        const hubUrl = environment.BACK_URL + '/signalhub';

        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(hubUrl, {
                transport: signalR.HttpTransportType.ServerSentEvents, // Spécifie toujours le transport SSE
                accessTokenFactory: () => token || ''
            })
            .withAutomaticReconnect([1000, 3000, 5000, 10000, 15000, 30000])
            .configureLogging(signalR.LogLevel.Information)
            .build();

        this.hubConnection
            .start()
            .then(() => {
                console.log('SignalR Connection started successfully using SSE!');
                this.addNotificationListener();
                if (groupName) {
                    this.joinGroup(groupName);
                }
            })
            .catch((err) => console.error('Error while starting SignalR connection: ' + err));

        this.hubConnection.onclose((error) => {
            console.log('SignalR connection closed.', error);
        });

        this.hubConnection.onreconnecting((error) => {
            console.log('SignalR connection reconnecting...', error);
        });

        this.hubConnection.onreconnected((connectionId) => {
            console.log('SignalR connection reconnected. New ConnectionId:', connectionId);
        });
    };

    public stopConnection = () => {
        this.hubConnection
            .stop()
            .then(() => console.log('SignalR Connection stopped.'))
            .catch((err) => console.error('Error while stopping SignalR connection: ' + err));
    };

    public addNotificationListener = () => {
        this.hubConnection.on('ReceiveNotification', (message: string) => {
            console.log('Received notifications:', message);
            this.notificationEventSignal.set({
                type: 'notificationIndividual',
                data: message
            });
            this.toastrService.add({ severity: 'success', summary: 'Success', detail: message });
        });
    };

    public sendNotificationToAll = (message: string) => {
        this.hubConnection.invoke('SendNotificationToAll', message).catch((err) => console.error('Error sending message to hub:', err));
    };

    public addGroupMessageListener = (groupName: string | null = null) => {
        this.hubConnection.on(groupName ?? 'ReceiveGroupMessage', (message: string) => {
            console.log('Received group message:', message);
            this.notificationEventSignal.set({
                type: 'notificationGroup',
                data: message
            });
            this.toastrService.add({ severity: 'success', summary: 'Success', detail: message });
        });
    };

    // Méthode pour appeler la méthode JoinGroup sur le Hub
    //
    public joinGroup = (groupName: string) => {
        if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
            this.hubConnection
                .invoke('JoinGroup', groupName)
                .then(() => {
                    console.log('Joined group:', groupName);
                    this.addGroupMessageListener(groupName);
                    this.sendMessageToGroup(groupName, 'Hello from client');
                })
                .catch((err) => console.error('Error joining group:', err));
        } else {
            console.warn('Cannot join group: SignalR connection not in "Connected" state.');
        }
    };

    // Méthode pour appeler la méthode LeaveGroup sur le Hub
    public leaveGroup = (groupName: string) => {
        if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
            this.hubConnection.invoke('LeaveGroup', groupName).catch((err) => console.error('Error leaving group:', err));
        } else {
            console.warn('Cannot leave group: SignalR connection not in "Connected" state.');
        }
    };

    // Méthode pour appeler la méthode SendMessageToGroup sur le Hub (si le client est autorisé)
    public sendMessageToGroup = (groupName: string, message: string) => {
        if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
            this.hubConnection.invoke('SendMessageToGroup', groupName, message).catch((err) => console.error('Error sending message to group:', err));
        } else {
            console.warn('Cannot send message to group: SignalR connection not in "Connected" state.');
        }
    };

    public AddNewGroup = (groupName: string) => {
        if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
            this.hubConnection
                .invoke('JoinGroup', groupName)
                .then(() => {
                    console.log('Joined group:', groupName);
                    this.addGroupMessageListener(groupName);
                    this.sendMessageToGroup(groupName, 'Hello from client');
                })
                .catch((err) => console.error('Error adding new group:', err));
        } else {
            console.warn('Cannot add new group: SignalR connection not in "Connected" state.');
        }
    };
}
