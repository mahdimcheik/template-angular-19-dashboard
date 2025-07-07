import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class GlobalService {
    // This service is used to manage global variables and methods that can be accessed from anywhere in the application.

    isFetching = signal<boolean>(false);

    constructor() {}
}
