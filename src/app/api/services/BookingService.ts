/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { BookingCreateDTO } from '../models/BookingCreateDTO';
import type { BookingResponseDTOListResponseDTO } from '../models/BookingResponseDTOListResponseDTO';
import type { QueryPagination } from '../models/QueryPagination';
import type { StringResponseDTO } from '../models/StringResponseDTO';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
@Injectable({
    providedIn: 'root',
})
export class BookingService {
    constructor(public readonly http: HttpClient) {}
    /**
     * @param requestBody
     * @returns StringResponseDTO OK
     * @throws ApiError
     */
    public postBookingBook(
        requestBody?: BookingCreateDTO,
    ): Observable<StringResponseDTO> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/booking/book',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param slotId
     * @returns StringResponseDTO OK
     * @throws ApiError
     */
    public deleteBookingUnbook(
        slotId?: string,
    ): Observable<StringResponseDTO> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/booking/unbook',
            query: {
                'slotId': slotId,
            },
        });
    }
    /**
     * @param slotId
     * @returns StringResponseDTO OK
     * @throws ApiError
     */
    public deleteBookingStudentUnbook(
        slotId?: string,
    ): Observable<StringResponseDTO> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/booking/student/unbook',
            query: {
                'slotId': slotId,
            },
        });
    }
    /**
     * @param requestBody
     * @returns StringResponseDTO OK
     * @throws ApiError
     */
    public postBookingBookPaid(
        requestBody?: Array<string>,
    ): Observable<StringResponseDTO> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/booking/book-paid',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns BookingResponseDTOListResponseDTO OK
     * @throws ApiError
     */
    public postBookingReservationsTeacher(
        requestBody?: QueryPagination,
    ): Observable<BookingResponseDTOListResponseDTO> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/booking/reservations-teacher',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns BookingResponseDTOListResponseDTO OK
     * @throws ApiError
     */
    public postBookingReservationsStudent(
        requestBody?: QueryPagination,
    ): Observable<BookingResponseDTOListResponseDTO> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/booking/reservations-student',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
