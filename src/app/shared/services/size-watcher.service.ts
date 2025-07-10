import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { auditTime, BehaviorSubject, debounceTime, distinctUntilChanged, fromEvent, map, switchMap, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SizeWatcherService {
    private destroyRef = inject(DestroyRef);
    // size = signal<'small' | 'medium' | 'large' | 'xlarge'>('small');

    size$ = new BehaviorSubject<'small' | 'medium' | 'large' | 'xlarge'>('small');
    windowSizeWatcher$ = fromEvent(window, 'resize').pipe(
        auditTime(200),
        distinctUntilChanged(),
        tap(() => {
            // this.windowWidth$.next(window.innerWidth);
            this.getSize();
        })
    );
    constructor() {
        this.getSize();
        this.windowSizeWatcher$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    }

    getSize() {
        if (window.innerWidth < 640) {
            this.size$.next('small');
        } else if (window.innerWidth < 768) {
            this.size$.next('medium');
        } else if (window.innerWidth < 1024) {
            this.size$.next('large');
        } else {
            this.size$.next('xlarge');
        }
    }
}
