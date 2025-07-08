/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { Notification } from '../models/Notification';
import type { NotificationFilter } from '../models/NotificationFilter';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
@Injectable({
    providedIn: 'root',
})
export class NotificationsService {
    constructor(public readonly http: HttpClient) {}
    /**
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public postNotifications(
        requestBody?: Notification,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/notifications',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public postNotificationsUser(
        requestBody?: NotificationFilter,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/notifications/user',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param notificationId
     * @param newValue
     * @returns any OK
     * @throws ApiError
     */
    public putNotifications(
        notificationId: string,
        newValue: boolean,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/notifications/{notificationId}/{newValue}',
            path: {
                'notificationId': notificationId,
                'newValue': newValue,
            },
        });
    }
}
