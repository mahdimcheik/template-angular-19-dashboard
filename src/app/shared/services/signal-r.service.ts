import { inject, Injectable, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, timer, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NotificationMainService } from './notificationMain.service';
import { Router } from '@angular/router';
import { LocalNotifications } from '@capacitor/local-notifications';

export enum ConnectionState {
    Connected = 'Connected',
    Disconnected = 'Disconnected',
    Reconnecting = 'Reconnecting',
    Error = 'Error'
}
/**
 * Service pour gérer la connexion SignalR.
 * Fournit des méthodes pour se connecter, envoyer des messages et gérer les notifications en temps réel.
 * Utilise SignalR pour la communication en temps réel avec le serveur.
 * Gère les états de connexion et les tentatives de reconnexion avec des délais exponentiels.
 */
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

    /**
     * Initialise et établit la connexion SignalR.
     * @param token Token d'authentification pour la connexion SignalR
     */
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

    /**
     * 
     * @param token Token d'authentification pour la connexion SignalR
     * Crée la connexion SignalR avec les paramètres appropriés.
     * Configure la reconnexion automatique avec des délais personnalisés.
     * Configure le logging pour la connexion.
     * @note Le transport WebSockets est utilisé par défaut si disponible.
     */
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

    /**
     * Démarre la connexion SignalR.
     * Gère les états de connexion et les tentatives de reconnexion avec des délais exponentiels.
     * Démarre un mécanisme de "heartbeat" pour maintenir la connexion active.
     */
    private async startConnection() {
        try {
            await this.hubConnection.start();
            this.connectionState$.next(ConnectionState.Connected);
            this.reconnectAttempts = 0;
            this.startHeartbeat();
        } catch (error) {
            this.connectionState$.next(ConnectionState.Error);
            this.scheduleReconnect();
        }
    }

    private registerEventHandlers() {
        // Connection state events
        this.hubConnection.onclose(() => {
            this.connectionState$.next(ConnectionState.Disconnected);
            this.stopHeartbeat();
            this.scheduleReconnect();
        });

        this.hubConnection.onreconnecting(() => {
            this.connectionState$.next(ConnectionState.Reconnecting);
        });

        this.hubConnection.onreconnected(() => {
            this.connectionState$.next(ConnectionState.Connected);
            this.reconnectAttempts = 0;
            this.startHeartbeat();
        });

        // Message handlers
        this.hubConnection.on('ReceiveMessage', (message) => {});

        this.hubConnection.on('Notification', (notification) => {
            this.notificationService.getNotificationsCount().subscribe();
            if (this.router.url === '/dashboard') {
                this.notificationService.getNotificationsByUserId({ perPage: 10, offset: 0 }).subscribe();
            }
            this.showNotif();
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

    async showNotif() {
        await LocalNotifications.schedule({
            notifications: [
                {
                    title: 'Notification test',
                    body: 'Ceci est une notification locale 📱',
                    id: 123,
                    schedule: { at: new Date(Date.now() + 2000) } // après 2 secondes
                }
            ]
        });
    }
}
