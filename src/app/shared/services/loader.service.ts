import { Injectable, signal } from '@angular/core';

// loader.service.ts
@Injectable({ providedIn: 'root' })
export class LoaderService {
    private loadingRequests = 0;
    isLoading = signal<boolean>(false);

    show(): void {
        this.loadingRequests++;
        this.isLoading.set(true);
    }

    hide(): void {
        this.loadingRequests = Math.max(0, this.loadingRequests - 1);
        if (this.loadingRequests === 0) {
            this.isLoading.set(false);
        }
    }
}
