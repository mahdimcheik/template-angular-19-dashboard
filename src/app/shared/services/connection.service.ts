import { Injectable, OnDestroy, signal } from '@angular/core';
import { auditTime, distinctUntilChanged, fromEvent, map, merge, of, startWith, Subscription } from 'rxjs';
/**
 * Service pour surveiller l'état de la connexion réseau.
 * Utilise les événements 'online' et 'offline' du navigateur pour détecter les changements de statut.
 * Expose un signal isOnline pour que les composants Angular puissent réagir aux changements de statut.
 */
@Injectable({
    providedIn: 'root'
})
export class ConnectionService implements OnDestroy {
    constructor() {}

    isOnline = signal<boolean>(navigator.onLine);
    isOnline$!: Subscription;

    checkNetworkStatus() {
        this.isOnline$ = merge(fromEvent(window, 'online'), fromEvent(window, 'offline'))
            .pipe(
                startWith(navigator.onLine),
                auditTime(5000),
                distinctUntilChanged(),
                map(() => navigator.onLine)
            )
            .subscribe((status) => {
                this.isOnline.set(status);
            });
    }

    ngOnDestroy(): void {
        this.isOnline$.unsubscribe();
    }
}
