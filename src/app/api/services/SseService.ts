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
export class SseService {
    constructor(public readonly http: HttpClient) {}
    /**
     * @param email
     * @param token
     * @returns any OK
     * @throws ApiError
     */
    public getSse(
        email: string,
        token: string,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/sse/{email}/{token}',
            path: {
                'email': email,
                'token': token,
            },
        });
    }
    /**
     * @param email
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public postSseNotify(
        email: string,
        requestBody?: string,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/sse/notify/{email}',
            path: {
                'email': email,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public postSseNotifyall(
        requestBody?: string,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/sse/notifyall',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
