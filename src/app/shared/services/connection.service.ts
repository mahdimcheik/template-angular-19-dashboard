import { Injectable, OnDestroy, signal } from '@angular/core';
import { auditTime, distinctUntilChanged, fromEvent, map, merge, of, startWith, Subscription } from 'rxjs';

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
                if (status) {
                    console.log('You are online!');
                } else {
                    console.log('You are offline!');
                }
            });
    }

    ngOnDestroy(): void {
        this.isOnline$.unsubscribe();
    }
}
