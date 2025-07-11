/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
@Injectable({
    providedIn: 'root',
})
export class OAuthService {
    constructor(public readonly http: HttpClient) {}
    /**
     * @param code
     * @param state
     * @returns any OK
     * @throws ApiError
     */
    public getGoogleCallback(
        code?: string,
        state?: string,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/google-callback',
            query: {
                'code': code,
                'state': state,
            },
        });
    }
    /**
     * @returns any OK
     * @throws ApiError
     */
    public getOauthGoogleLogin(): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/oauth/google-login',
        });
    }
}
