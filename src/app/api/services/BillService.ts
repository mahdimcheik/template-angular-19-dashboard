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
export class BillService {
    constructor(public readonly http: HttpClient) {}
    /**
     * @param orderId
     * @returns binary PDF file
     * @throws ApiError
     */
    public getBillExport(
        orderId?: string,
    ): Observable<Blob> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/bill/export',
            query: {
                'orderId': orderId,
            },
        });
    }
}
