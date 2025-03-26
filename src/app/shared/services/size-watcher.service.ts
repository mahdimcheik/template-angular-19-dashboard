import { Injectable, signal } from '@angular/core';
import { auditTime, BehaviorSubject, debounceTime, distinctUntilChanged, fromEvent, map, switchMap, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SizeWatcherService {
    windowSizeWatcher$ = fromEvent(window, 'resize').pipe(
        auditTime(200),
        distinctUntilChanged(),
        tap(() => {
            this.windowWidth$.next(window.innerWidth);
        })
    );
    windowWidth$ = new BehaviorSubject(window.innerWidth);
    constructor() {
        this.windowSizeWatcher$.subscribe();
    }
}
