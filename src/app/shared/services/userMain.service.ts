import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { catchError, finalize, Observable, of, switchMap, tap } from 'rxjs';
import { MenuItem, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { LocalstorageService } from './localstorage.service';
// import { SSEMainService } from './sseMain.service';

// Generated services and models
import { UsersService as GeneratedUsersService } from '../../api/services/UsersService';
import { UserResponseDTO } from '../../api/models/UserResponseDTO';
import { UserCreateDTO } from '../../api/models/UserCreateDTO';
import { UserUpdateDTO } from '../../api/models/UserUpdateDTO';
import { UserLoginDTO } from '../../api/models/UserLoginDTO';
import { ForgotPasswordInput } from '../../api/models/ForgotPasswordInput';
import { PasswordRecoveryInput } from '../../api/models/PasswordRecoveryInput';
import { LoginOutputDTOResponseDTO } from '../../api/models/LoginOutputDTOResponseDTO';
import { ObjectResponseDTO } from '../../api/models/ObjectResponseDTO';
import { CookieConsentService } from './cookie-consent.service';
import { EnumGender, GenderDropDown } from '../../shared/models/user';
import { UserResponseDTOResponsePaginationResponseDTO } from '../../api/models/UserResponseDTOResponsePaginationResponseDTO';

// Type aliases for backward compatibility
export type { UserResponseDTO, UserCreateDTO, UserUpdateDTO, UserLoginDTO };
export type UserChangePasswordDTO = PasswordRecoveryInput;

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

// Legacy ResponseDTO type for backward compatibility
export type ResponseDTO = {
    message: string;
    status: number;
    data?: any;
    count?: number;
};

@Injectable({
    providedIn: 'root'
})
export class UserMainService {
    baseUrl = environment.BACK_URL;
    private generatedUsersService = inject(GeneratedUsersService);
    private localStorageService = inject(LocalstorageService);

    router = inject(Router);
    messageService = inject(MessageService);
    cookieConsentService = inject(CookieConsentService);
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

    typesGenderList: GenderDropDown[] = [
        {
            id: '0',
            name: 'Homme',
            value: EnumGender.Homme
        },
        {
            id: '1',
            name: 'Femme',
            value: EnumGender.Femme
        },
        {
            id: '2',
            name: 'Non-binaire',
            value: EnumGender.NonBinaire
        },
        {
            id: '3',
            name: 'Autre',
            value: EnumGender.Autre
        }
    ];

    constructor() {
        effect(() => {
            this.isAdmin()
                ? this.model.set([
                      { label: 'Tableau de bord', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard'] },
                      { label: 'Réservations', icon: 'pi pi-fw pi-list', routerLink: ['/dashboard/reservation/list'] },
                      { label: 'Calendrier', icon: 'pi pi-fw pi-calendar', routerLink: ['/dashboard/reservation/calendar-for-teacher'] },
                      { label: 'Utilisateurs', icon: 'pi pi-users', routerLink: ['/dashboard/students-list'] },
                      { label: 'Profil', icon: 'pi pi-fw pi-calendar', routerLink: ['/dashboard/profile/me'] }
                  ])
                : this.model.set([
                      { label: 'Tableau de bord', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard'] },
                      { label: 'Réservations', icon: 'pi pi-fw pi-list', routerLink: ['/dashboard/reservation/list'] },
                      { label: 'Calendrier', icon: 'pi pi-fw pi-calendar', routerLink: ['/dashboard/reservation/calendar-for-student'] },
                      { label: 'Mes Commandes', icon: 'pi pi-cart-arrow-down', routerLink: ['/dashboard/reservation/orders-student'] },
                      { label: 'Profil', icon: 'pi pi-fw pi-user', routerLink: ['/dashboard/profile/me'] },
                      { label: 'Contact', icon: 'pi pi-fw pi-at', routerLink: ['/dashboard/contact'] }
                  ]);
        });
    }

    getUsers(first: number, rows: number): Observable<ResponseDTO> {
        return this.generatedUsersService.getUsersAll(first, rows).pipe(
            switchMap((response: UserResponseDTOResponsePaginationResponseDTO) => {
                const legacyResponse: ResponseDTO = {
                    message: response.message || '',
                    status: response.status || 200,
                    data: response.data,
                    count: response.count || undefined
                };
                return of(legacyResponse);
            })
        );
    }

    register(userDTO: UserCreateDTO): Observable<ResponseRegister> {
        return this.generatedUsersService.postUsersRegister(userDTO).pipe(
            switchMap((response: any) => {
                // Transform to expected format
                const registerResponse: ResponseRegister = {
                    succeeded: response.succeeded || false,
                    errors: response.errors || []
                };
                return of(registerResponse);
            })
        );
    }

    resendConfirmationLink(): Observable<ResponseDTO> {
        return this.generatedUsersService.getUsersResendConfirmationLink().pipe(
            switchMap((response: any) => {
                const legacyResponse: ResponseDTO = {
                    message: response.message || 'Lien de confirmation renvoyé',
                    status: response.status || 200,
                    data: response.data
                };
                return of(legacyResponse);
            }),
            tap((res) => this.messageService.add({ severity: 'success', summary: 'Succès', detail: res.message }))
        );
    }

    login(userLoginDTO: UserLoginDTO): Observable<ResponseDTO> {
        return this.generatedUsersService.postUsersLogin(userLoginDTO).pipe(
            switchMap((response: LoginOutputDTOResponseDTO) => {
                const legacyResponse: ResponseDTO = {
                    message: response.message || '',
                    status: response.status || 200,
                    data: response.data
                };
                return of(legacyResponse);
            }),
            tap((res) => {
                if (res.data) {
                    this.cookieConsentService.acceptAll();
                    this.userConnected.set(res.data.user);
                    this.token.set(res.data.token);
                }
            })
        );
    }

    refreshToken(): Observable<ResponseDTO> {
        return this.generatedUsersService.getUsersRefreshToken().pipe(
            switchMap((response: any) => {
                const legacyResponse: ResponseDTO = {
                    message: response.message || '',
                    status: response.status || 200,
                    data: response.data
                };
                return of(legacyResponse);
            }),
            tap((res) => {
                if (res.data) {
                    this.token.set(res.data.token);
                    this.userConnected.set(res.data.user);
                }
            })
        );
    }

    logout(): void {
        this.generatedUsersService
            .getUsersLogout()
            .pipe(
                finalize(() => {
                    this.reset();
                    this.router.navigate(['/']);
                })
            )
            .subscribe(() => {
                this.cookieConsentService.withdrawConsent();
            });
    }

    getprofile(): Observable<ResponseDTO> {
        return this.generatedUsersService.getUsersMyInformations().pipe(
            switchMap((response: ObjectResponseDTO) => {
                const legacyResponse: ResponseDTO = {
                    message: response.message || '',
                    status: response.status || 200,
                    data: response.data
                };
                return of(legacyResponse);
            }),
            tap((res) => {
                if (res.data?.user) {
                    this.userConnected.set(res.data.user);
                    this.token.set(res.data.token);
                }
            })
        );
    }

    getprofileById(userId: string): Observable<ResponseDTO> {
        return this.generatedUsersService.getUsersPublicInformations(userId).pipe(
            switchMap((response: ObjectResponseDTO) => {
                const legacyResponse: ResponseDTO = {
                    message: response.message || '',
                    status: response.status || 200,
                    data: response.data
                };
                return of(legacyResponse);
            })
        );
    }

    getTeacherProfile(): Observable<ResponseDTO> {
        return this.generatedUsersService.getUsersPublicInformations('teacher').pipe(
            switchMap((response: ObjectResponseDTO) => {
                const legacyResponse: ResponseDTO = {
                    message: response.message || '',
                    status: response.status || 200,
                    data: response.data
                };
                return of(legacyResponse);
            }),
            tap((res) => this.teacherDetails.set(res.data))
        );
    }

    getPublicProfile(userId: string): Observable<ResponseDTO> {
        return this.generatedUsersService.getUsersPublicInformations(userId).pipe(
            switchMap((response: ObjectResponseDTO) => {
                const legacyResponse: ResponseDTO = {
                    message: response.message || '',
                    status: response.status || 200,
                    data: response.data
                };
                return of(legacyResponse);
            }),
            tap((res) => this.teacherDetails.set(res.data))
        );
    }

    forgotPassword(input: { email: string }): Observable<ResponseDTO> {
        const forgotPasswordInput: ForgotPasswordInput = {
            email: input.email
        };
        return this.generatedUsersService.postUsersForgotPassword(forgotPasswordInput).pipe(
            switchMap((response: ObjectResponseDTO) => {
                const legacyResponse: ResponseDTO = {
                    message: response.message || '',
                    status: response.status || 200,
                    data: response.data
                };
                return of(legacyResponse);
            })
        );
    }

    resetPassword(changePassword: UserChangePasswordDTO): Observable<ResponseDTO> {
        return this.generatedUsersService.postUsersResetPassword(changePassword).pipe(
            switchMap((response: ObjectResponseDTO) => {
                const legacyResponse: ResponseDTO = {
                    message: response.message || '',
                    status: response.status || 200,
                    data: response.data
                };
                return of(legacyResponse);
            })
        );
    }

    reset(): void {
        this.localStorageService.reset();
        this.userConnected.set({} as UserResponseDTO);
        this.token.set('');
    }

    updatePersonnalInfos(userUpdated: UserUpdateDTO): Observable<ResponseDTO> {
        return this.generatedUsersService.patchUsersUpdate(userUpdated).pipe(
            switchMap((response: any) => {
                const legacyResponse: ResponseDTO = {
                    message: response.message || '',
                    status: response.status || 200,
                    data: response.data
                };
                return of(legacyResponse);
            }),
            tap((res) => {
                if (res.data) {
                    this.userConnected.set(res.data);
                    this.userToDisplay.set(res.data);
                    this.localStorageService.setUser(res.data);
                }
            })
        );
    }

    updateAvatar(file: File): Observable<ResponseDTO> {
        if (file) {
            const formData = {
                file: file
            };
            return this.generatedUsersService.postUsersUploadAvatar(formData).pipe(
                switchMap((response: any) => {
                    const legacyResponse: ResponseDTO = {
                        message: response.message || '',
                        status: response.status || 200,
                        data: response.data
                    };
                    return of(legacyResponse);
                })
            );
        } else {
            return of({} as ResponseDTO);
        }
    }
}
