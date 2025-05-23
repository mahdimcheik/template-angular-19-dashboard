import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit, computed, inject, signal } from '@angular/core';
import { ResponseDTO, UserChangePasswordDTO, UserCreateDTO, UserLoginDTO, UserResponseDTO, UserUpdateDTO } from '../models/user';
import { catchError, Observable, of, switchMap, tap } from 'rxjs';
import { LocalstorageService } from './localstorage.service';
import { MessageService } from 'primeng/api';
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

    login(userLoginDTO: UserLoginDTO): Observable<ResponseDTO> {
        return this.http.post<ResponseDTO>(`${environment.BACK_URL}/Users/login`, userLoginDTO).pipe(
            tap((res) => {
                this.userConnected.set((res.data as { token: string; user: UserResponseDTO }).user);
                this.token.set((res.data as { token: string; user: UserResponseDTO }).token);
                this.refreshAccessToken.set(
                    (
                        res.data as {
                            refreshToken: string;
                            user: UserResponseDTO;
                            token: string;
                        }
                    ).refreshToken
                );
                this.localStorageService.setUser(this.userConnected());
                this.localStorageService.setToken(this.token());
                this.localStorageService.setRefreshToken(this.refreshAccessToken() ?? '');

                this.SseService.subscribeSSE(this.userConnected().email, this.token());

                // this.messageService.add({
                //     severity: 'success',
                //     summary: 'Bienvenu ! ',
                //     detail: res.message ?? 'Youpi!!!'
                // });
                /* // sse to delete or not ?
                const eventSource = new EventSource(`${environment.BACK_URL}/sse/${this.userConnected().id}`);

                eventSource.onmessage = (event) => {
                    console.log('event', event);
                    this.userConnected.set(JSON.parse(event.data));
                };
                */

                // if (this.userConnected().roles.includes('Admin')) {
                //     this.router.navigateByUrl('/');
                // } else {
                //     this.router.navigateByUrl('/');
                // }
            })
        );
    }

    refreshToken() {
        // Call your backend refresh token endpoint
        return this.http
            .post<ResponseDTO>(`${environment.BACK_URL}/Users/refresh-token`, {
                refreshToken: this.localStorageService.getRefreshToken(),
                token: this.localStorageService.getToken()
            })
            .pipe(
                tap((tokens) => {
                    console.log('response refresh token', tokens);

                    // Update tokens in localStorage
                    this.localStorageService.setToken(tokens.data.accessToken);
                    // this.localStorageService.setRefreshToken(tokens.data.refreshToken);

                    // Update the access token in memory
                    // this.refreshAccessToken.set(tokens.data.refreshToken);
                    this.token.set(tokens.data.accessToken);
                    console.log('new token from interceptor', this.token());
                }),
                catchError((err) => {
                    // Handle refresh token errors
                    this.reset();
                    throw err;
                })
            );
    }

    logout(): void {
        this.reset();
        this.router.navigateByUrl('/');
    }

    getprofile(): Observable<ResponseDTO> {
        this.userConnected.set(this.localStorageService.getUser());
        this.token.set(this.localStorageService.getToken());

        return this.http.get<ResponseDTO>(`${environment.BACK_URL}/users/my-informations`).pipe(
            tap((res) => {
                this.userConnected.set((res.data as { token: string; user: UserResponseDTO }).user);
                this.localStorageService.setUser(this.userConnected());
                this.SseService.subscribeSSE(this.userConnected().email, this.token());
            }),
            catchError((error) => {
                this.reset();
                return of();
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
