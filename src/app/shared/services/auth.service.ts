import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit, computed, inject, signal } from '@angular/core';
import { ResponseDTO, UserChangePasswordDTO, UserCreateDTO, UserLoginDTO, UserResponseDTO, UserUpdateDTO } from '../models/user';
import { catchError, finalize, Observable, of, switchMap, tap } from 'rxjs';
import { LocalstorageService } from './localstorage.service';
import { MenuItem, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { SSEService } from './sse.service';

type ResponseRegister = {
    succeeded: boolean;
    errors: string[];
};

export interface PageEvent {
    first: number;
    rows: number;
    page: number;
    pageCount: number;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    baseUrl = environment.BACK_URL;
    private http: HttpClient = inject(HttpClient);
    private localStorageService = inject(LocalstorageService);

    router = inject(Router);
    messageService = inject(MessageService);
    SseService = inject(SSEService);

    // pour la page profile
    userConnected = signal({} as UserResponseDTO);
    userToDisplay = signal({} as UserResponseDTO);

    isAdmin = computed(() => this.userConnected()?.roles?.includes('Admin'));

    // lien de side navbar
    model = signal<MenuItem[]>([]);

    // pour la page qui je suis ?
    teacherDetails = signal({} as UserResponseDTO);

    refreshAccessToken = signal<string | null>(null);
    token = signal<string>('');

    getUsers(first: number, rows: number): Observable<ResponseDTO> {
        return this.http.get<ResponseDTO>(`${environment.BACK_URL}/Users/all?first=${first}&rows=${rows}`);
    }

    register(userDTO: UserCreateDTO): Observable<ResponseRegister> {
        return this.http.post<ResponseRegister>(`${environment.BACK_URL}/Users/register`, userDTO);
    }

    resendConfirmationLink(): Observable<ResponseDTO> {
        return this.http.get<ResponseDTO>(`${environment.BACK_URL}/Users/resend-confirmation-link`).pipe(tap((res) => this.messageService.add({ severity: 'success', summary: 'Succès', detail: res.message })));
    }

    login(userLoginDTO: UserLoginDTO): Observable<ResponseDTO> {
        return this.http.post<ResponseDTO>(`${environment.BACK_URL}/Users/login`, userLoginDTO).pipe(
            tap((res) => {
                this.userConnected.set((res.data as { token: string; user: UserResponseDTO }).user);
                this.token.set((res.data as { token: string; user: UserResponseDTO }).token);
                this.model.set(
                    this.isAdmin()
                        ? [
                              { label: 'Tableau de bord', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard'] },
                              { label: 'Réservations', icon: 'pi pi-fw pi-list', routerLink: ['/dashboard/reservation/teacher'] },
                              { label: 'Calendrier', icon: 'pi pi-fw pi-calendar', routerLink: ['/dashboard/reservation/calendar-for-teacher'] },
                              { label: 'Utilisateurs', icon: 'pi pi-users', routerLink: ['/dashboard/students-list'] },
                              { label: 'Profil', icon: 'pi pi-fw pi-calendar', routerLink: ['/dashboard/profile/me'] }
                          ]
                        : [
                              { label: 'Tableau de bord', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard'] },
                              { label: 'Réservations', icon: 'pi pi-fw pi-list', routerLink: ['/dashboard/reservation/teacher'] },
                              { label: 'Calendrier', icon: 'pi pi-fw pi-calendar', routerLink: ['/dashboard/reservation/calendar-for-student'] },
                              { label: 'Mes Commandes', icon: 'pi pi-cart-arrow-down', routerLink: ['/dashboard/reservation/orders-student'] },
                              { label: 'Profil', icon: 'pi pi-fw pi-user', routerLink: ['/dashboard/profile/me'] },
                              { label: 'Contact', icon: 'pi pi-fw pi-at', routerLink: ['/dashboard/contact'] }
                          ]
                );
            })
        );
    }

    refreshToken() {
        return this.http.get<ResponseDTO>(`${environment.BACK_URL}/Users/refresh-token`).pipe(
            tap((res) => {
                console.log('response refresh token', res);

                this.token.set(res.data.token);
                this.userConnected.set((res.data as { token: string; user: UserResponseDTO }).user);
                console.log('new token from interceptor', this.token());

                this.model.set(
                    this.isAdmin()
                        ? [
                              { label: 'Tableau de bord', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard'] },
                              { label: 'Réservations', icon: 'pi pi-fw pi-list', routerLink: ['/dashboard/reservation/teacher'] },
                              { label: 'Calendrier', icon: 'pi pi-fw pi-calendar', routerLink: ['/dashboard/reservation/calendar-for-teacher'] },
                              { label: 'Utilisateurs', icon: 'pi pi-users', routerLink: ['/dashboard/students-list'] },
                              { label: 'Profil', icon: 'pi pi-fw pi-calendar', routerLink: ['/dashboard/profile/me'] }
                          ]
                        : [
                              { label: 'Tableau de bord', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard'] },
                              { label: 'Réservations', icon: 'pi pi-fw pi-list', routerLink: ['/dashboard/reservation/teacher'] },
                              { label: 'Calendrier', icon: 'pi pi-fw pi-calendar', routerLink: ['/dashboard/reservation/calendar-for-student'] },
                              { label: 'Mes Commandes', icon: 'pi pi-cart-arrow-down', routerLink: ['/dashboard/reservation/orders-student'] },
                              { label: 'Profil', icon: 'pi pi-fw pi-user', routerLink: ['/dashboard/profile/me'] }
                          ]
                );
            })
        );
    }

    logout(): void {
        this.http
            .get(`${environment.BACK_URL}/users/logout`)
            .pipe(
                finalize(() => {
                    this.reset();
                    this.router.navigateByUrl('/');
                })
            )
            .subscribe();
    }

    getprofile(): Observable<ResponseDTO> {
        return this.http.get<ResponseDTO>(`${environment.BACK_URL}/users/my-informations`).pipe(
            tap((res) => {
                this.userConnected.set((res.data as { token: string; user: UserResponseDTO }).user);

                this.model.set(
                    this.isAdmin()
                        ? [
                              { label: 'Tableau de bord', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard'] },
                              { label: 'Réservations', icon: 'pi pi-fw pi-list', routerLink: ['/dashboard/reservation/teacher'] },
                              { label: 'Calendrier', icon: 'pi pi-fw pi-calendar', routerLink: ['/dashboard/reservation/calendar-for-teacher'] },
                              { label: 'Utilisateurs', icon: 'pi pi-users', routerLink: ['/dashboard/students-list'] },
                              { label: 'Profil', icon: 'pi pi-fw pi-calendar', routerLink: ['/dashboard/profile/me'] }
                          ]
                        : [
                              { label: 'Tableau de bord', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard'] },
                              { label: 'Réservations', icon: 'pi pi-fw pi-list', routerLink: ['/dashboard/reservation/teacher'] },
                              { label: 'Calendrier', icon: 'pi pi-fw pi-calendar', routerLink: ['/dashboard/reservation/calendar-for-student'] },
                              { label: 'Mes Commandes', icon: 'pi pi-cart-arrow-down', routerLink: ['/dashboard/reservation/orders-student'] },
                              { label: 'Profil', icon: 'pi pi-fw pi-user', routerLink: ['/dashboard/profile/me'] }
                          ]
                );
            })
        );
    }

    getprofileById(userId: string): Observable<ResponseDTO> {
        return this.http.get<ResponseDTO>(`${environment.BACK_URL}/users/public-informations?userId=${userId}`);
    }

    getTeacherProfile(): Observable<ResponseDTO> {
        return this.http.get<ResponseDTO>(`${environment.BACK_URL}/users/public-informations?userId=teacher`).pipe(tap((res) => this.teacherDetails.set(res.data)));
    }

    getPublicProfile(userId: string): Observable<ResponseDTO> {
        return this.http.get<ResponseDTO>(`${environment.BACK_URL}/users/public-informations?userId=${userId}`).pipe(tap((res) => this.teacherDetails.set(res.data)));
    }

    forgotPassword(input: { email: string }): Observable<ResponseDTO> {
        return this.http.post<ResponseDTO>(`${environment.BACK_URL}/users/forgot-password`, input);
    }

    resetPassword(changePassword: UserChangePasswordDTO): Observable<ResponseDTO> {
        return this.http.post<ResponseDTO>(`${environment.BACK_URL}/users/reset-password`, changePassword);
    }

    reset(): void {
        // this.localStorageService.setUser({} as UserResponseDTO);
        this.localStorageService.reset();
        this.userConnected.set({} as UserResponseDTO);
        this.token.set('');
    }

    updatePersonnalInfos(userUpdated: UserUpdateDTO): Observable<ResponseDTO> {
        return this.http.patch<ResponseDTO>(`${this.baseUrl}/users/update`, userUpdated).pipe(
            tap((res) => {
                this.userConnected.set(res.data);
                this.userToDisplay.set(res.data);
                this.localStorageService.setUser(res.data);
            })
        );
    }

    updateAvatar(file: File): Observable<ResponseDTO> {
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            const headers = new HttpHeaders();
            return this.http.post<ResponseDTO>(`${this.baseUrl}/users/upload-avatar`, formData, {
                headers: headers
            });
        } else return of();
    }
}
