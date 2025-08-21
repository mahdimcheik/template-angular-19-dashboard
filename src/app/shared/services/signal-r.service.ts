// // src/app/services/chat.service.ts
// import { Injectable } from '@angular/core';
// import * as signalR from '@microsoft/signalr';
// import { BehaviorSubject } from 'rxjs';
// import { environment } from '../../../environments/environment';

// @Injectable({
//     providedIn: 'root'
// })
// export class SignalRService {
//     baseUrl = environment.BACK_URL;
//     private hubConnection!: signalR.HubConnection;
//     private messagesSubject = new BehaviorSubject<{ user: string; message: string }[]>([]);
//     messages$ = this.messagesSubject.asObservable();
//     pingInterval: any;

//     constructor() {
//         // this.startConnection();
//     }

//     startConnection(token: string) {
//         this.hubConnection = new signalR.HubConnectionBuilder()
//             .withUrl(`${this.baseUrl}/chathub`, {
//                 accessTokenFactory: () => token
//                 // transport: signalR.HttpTransportType.WebSockets,
//             })
//             .withAutomaticReconnect({
//         nextRetryDelayInMilliseconds: (retryContext) => {
//           // Custom retry delays: 0, 2s, 10s, 30s, then stop
//           const delays = [0, 2000, 10000, 30000];
//           return delays[retryContext.previousRetryCount] || null;
//         }
//       })
//             .build();

//         this.hubConnection.start().catch((err) => console.error('Error while starting connection: ' + err));

//         this.hubConnection.on('ReceiveMessage', (user: string, message: string) => {
//             console.log('ReceiveMessage', user, message);

//             this.hubConnection.onreconnecting((error) => {
//                 console.log('Reconnecting...', error);
//             });
//             this.hubConnection.onreconnected((connectionId) => {
//                 console.log('Reconnected with connectionId: ' + connectionId);
//             });
//             this.hubConnection.onreconnected((connectionId) => {
//                 console.log('Reconnected with connectionId: ' + connectionId);
//             });

//             const current = this.messagesSubject.value;
//             this.messagesSubject.next([...current, { user, message }]);
//             this.getOnlineCount();
//         });
//     }

//       // Client-side heartbeat to detect connection issues
//   private startHeartbeat() {
//     this.stopHeartbeat();
//     this.pingInterval = setInterval(async () => {
//       try {
//         if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
//           // Try to call a server method to verify connection
//           await this.hubConnection.invoke('GetOnlineCount');
//         }
//       } catch (error) {
//         console.warn('Heartbeat failed:', error);
//         // Connection might be dead, trigger reconnection
//         this.handleConnectionError();
//       }
//     }, 30000); // Ping every 30 seconds
//   }

//   private stopHeartbeat() {
//     if (this.pingInterval) {
//       clearInterval(this.pingInterval);
//       this.pingInterval = null;
//     }
//   }

//     stopConnection() {
//         this.hubConnection.stop();
//     }

//     sendMessage(user: string, message: string) {
//         if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
//             this.hubConnection.invoke('SendMessage', user, message).catch((err) => console.error(err));
//         } else {
//             console.log('Connection not established');
//         }
//     }

//     getOnlineCount() {
//         this.hubConnection.invoke('GetOnlineCount').then((count) => {
//             console.log('Clients connectés :', count);
//         });
//     }
// }

// connection.service.ts
import { inject, Injectable, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, timer, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NotificationMainService } from './notificationMain.service';
import { Router } from '@angular/router';

export enum ConnectionState {
    Connected = 'Connected',
    Disconnected = 'Disconnected',
    Reconnecting = 'Reconnecting',
    Error = 'Error'
}

@Injectable({ providedIn: 'root' })
export class SignalRService {
    private notificationService = inject(NotificationMainService);
    private router = inject(Router);
    private hubConnection!: signalR.HubConnection;
    private connectionState$ = new BehaviorSubject<ConnectionState>(ConnectionState.Disconnected);
    private messageReceived$ = new Subject<any>();
    baseUrl = environment.BACK_URL;

    private pingInterval: any;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;

    constructor() {}

    initiateAndConnect(token: string) {
        this.createConnection(token);
        this.startConnection();
        this.registerEventHandlers();
    }

    // Observable for connection state
    getConnectionState() {
        return this.connectionState$.asObservable();
    }

    // Observable for received messages
    getMessages() {
        return this.messageReceived$.asObservable();
    }

    private createConnection(token: string) {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${this.baseUrl}/chathub`, {
                accessTokenFactory: () => token
                // transport: signalR.HttpTransportType.WebSockets,
            })
            .withAutomaticReconnect({
                nextRetryDelayInMilliseconds: (retryContext) => {
                    // Custom retry delays: 0, 2s, 10s, 30s, then stop
                    const delays = [0, 2000, 10000, 30000];
                    return delays[retryContext.previousRetryCount] || null;
                }
            })
            .configureLogging(signalR.LogLevel.Information)
            .build();
    }

    private async startConnection() {
        try {
            await this.hubConnection.start();
            this.connectionState$.next(ConnectionState.Connected);
            this.reconnectAttempts = 0;
            this.startHeartbeat();
            console.log('SignalR Connected');
        } catch (error) {
            this.connectionState$.next(ConnectionState.Error);
            console.error('SignalR Connection Error:', error);
            this.scheduleReconnect();
        }
    }

    private registerEventHandlers() {
        // Connection state events
        this.hubConnection.onclose(() => {
            this.connectionState$.next(ConnectionState.Disconnected);
            this.stopHeartbeat();
            console.log('SignalR Disconnected');
            this.scheduleReconnect();
        });

        this.hubConnection.onreconnecting(() => {
            this.connectionState$.next(ConnectionState.Reconnecting);
            console.log('SignalR Reconnecting...');
        });

        this.hubConnection.onreconnected(() => {
            this.connectionState$.next(ConnectionState.Connected);
            this.reconnectAttempts = 0;
            this.startHeartbeat();
            console.log('SignalR Reconnected');
        });

        // Message handlers
        this.hubConnection.on('ReceiveMessage', (message) => {});

        this.hubConnection.on('Notification', (notification) => {
            this.notificationService.getNotificationsCount().subscribe();
            console.log('route', this.router.url);
            if (this.router.url === '/dashboard') {
                this.notificationService.getNotificationsByUserId({ perPage: 10, offset: 0 }).subscribe();
            }
        });

        this.hubConnection.on('Email', (notification) => {});

        this.hubConnection.on('Chat', (notification) => {});

        this.hubConnection.on('ping', () => {});
    }

    private startHeartbeat() {
        this.stopHeartbeat();
        this.pingInterval = setInterval(async () => {
            try {
                if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
                    await this.hubConnection.invoke('GetOnlineCount');
                }
            } catch (error) {
                this.handleConnectionError();
            }
        }, 30000);
    }

    private stopHeartbeat() {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
        }
    }

    private scheduleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            const delay = Math.pow(2, this.reconnectAttempts) * 1000;
            this.reconnectAttempts++;

            setTimeout(() => {
                console.log(`Attempting reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
                this.startConnection();
            }, delay);
        } else {
            this.connectionState$.next(ConnectionState.Error);
        }
    }

    private handleConnectionError() {
        if (this.hubConnection.state !== signalR.HubConnectionState.Disconnected) {
            this.hubConnection.stop();
        }
    }

    async sendMessage(message: any) {
        try {
            if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
                await this.hubConnection.invoke('SendMessageByUserEmail', 'professeur@skill-hive.fr', 'Email', message);
            } else {
                throw new Error('Not connected to server');
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            throw error;
        }
    }

    async getOnlineCount(): Promise<number> {
        try {
            return await this.hubConnection.invoke('GetOnlineCount');
        } catch (error) {
            console.error('Failed to get online count:', error);
            return 0;
        }
    }
}
