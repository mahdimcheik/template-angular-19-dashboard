import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { LocalstorageService } from './app/shared/services/localstorage.service';
import { AuthService } from './app/shared/services/auth.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, ToastModule],
    providers: [MessageService],
    template: `<router-outlet></router-outlet> `
})
export class AppComponent implements OnInit {
    localStorageService = inject(LocalstorageService);
    authService = inject(AuthService);
    router = inject(Router);
    ngOnInit(): void {
        try {
            const user = this.localStorageService.getUser();
            if (user !== null && user !== undefined && user.email !== '') {
                this.authService.userConnected.set(user);
            }
        } catch (e) {
            console.log('AppComponent error', e);
            this.router.navigateByUrl('/');
        }
    }
}
