import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ResponseDTO, UserResponseDTO } from '../models/user';
import { catchError, map, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    http = inject(HttpClient);
    baseUrl = environment.BACK_URL;

    getAllStudents(start: number, perPage: number) {
        return this.http.post<ResponseDTO>(this.baseUrl + '/admin/all-students', { start, perPage }).pipe(
            catchError((err) => {
                console.error(err);
                return throwError(() => err);
            })
        );
    }
}
