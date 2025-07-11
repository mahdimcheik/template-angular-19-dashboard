/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { ForgotPasswordInput } from '../models/ForgotPasswordInput';
import type { LoginOutputDTOResponseDTO } from '../models/LoginOutputDTOResponseDTO';
import type { ObjectIEnumerableResponseDTO } from '../models/ObjectIEnumerableResponseDTO';
import type { ObjectResponseDTO } from '../models/ObjectResponseDTO';
import type { PasswordRecoveryInput } from '../models/PasswordRecoveryInput';
import type { UserCreateDTO } from '../models/UserCreateDTO';
import type { UserLoginDTO } from '../models/UserLoginDTO';
import type { UserUpdateDTO } from '../models/UserUpdateDTO';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
@Injectable({
    providedIn: 'root',
})
export class UsersService {
    constructor(public readonly http: HttpClient) {}
    /**
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public postUsersRegister(
        requestBody?: UserCreateDTO,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/users/register',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public patchUsersUpdate(
        requestBody?: UserUpdateDTO,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'PATCH',
            url: '/users/update',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param formData
     * @returns any OK
     * @throws ApiError
     */
    public postUsersUploadAvatar(
        formData?: {
            file?: Blob;
        },
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/users/upload-avatar',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
    /**
     * @param requestBody
     * @returns LoginOutputDTOResponseDTO OK
     * @throws ApiError
     */
    public postUsersLogin(
        requestBody?: UserLoginDTO,
    ): Observable<LoginOutputDTOResponseDTO> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/users/login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param userId
     * @param confirmationToken
     * @returns ObjectResponseDTO OK
     * @throws ApiError
     */
    public getUsersEmailConfirmation(
        userId?: string,
        confirmationToken?: string,
    ): Observable<ObjectResponseDTO> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/users/email-confirmation',
            query: {
                'userId': userId,
                'confirmationToken': confirmationToken,
            },
        });
    }
    /**
     * @returns any OK
     * @throws ApiError
     */
    public getUsersResendConfirmationLink(): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/users/resend-confirmation-link',
        });
    }
    /**
     * @returns ObjectResponseDTO OK
     * @throws ApiError
     */
    public getUsersMyInformations(): Observable<ObjectResponseDTO> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/users/my-informations',
        });
    }
    /**
     * @param userId
     * @returns ObjectResponseDTO OK
     * @throws ApiError
     */
    public getUsersPublicInformations(
        userId?: string,
    ): Observable<ObjectResponseDTO> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/users/public-informations',
            query: {
                'userId': userId,
            },
        });
    }
    /**
     * @param requestBody
     * @returns ObjectResponseDTO OK
     * @throws ApiError
     */
    public postUsersForgotPassword(
        requestBody?: ForgotPasswordInput,
    ): Observable<ObjectResponseDTO> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/users/forgot-password',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns ObjectResponseDTO OK
     * @throws ApiError
     */
    public postUsersResetPassword(
        requestBody?: PasswordRecoveryInput,
    ): Observable<ObjectResponseDTO> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/users/reset-password',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns any OK
     * @throws ApiError
     */
    public getUsersRefreshToken(): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/users/refresh-token',
        });
    }
    /**
     * @param first
     * @param rows
     * @returns ObjectIEnumerableResponseDTO OK
     * @throws ApiError
     */
    public getUsersAll(
        first?: number,
        rows?: number,
    ): Observable<ObjectIEnumerableResponseDTO> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/users/all',
            query: {
                'first': first,
                'rows': rows,
            },
        });
    }
    /**
     * @returns any OK
     * @throws ApiError
     */
    public getUsersLogout(): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/users/logout',
        });
    }
    /**
     * @returns any OK
     * @throws ApiError
     */
    public getUsersSeed(): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/users/seed',
        });
    }
}
