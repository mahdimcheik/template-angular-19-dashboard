import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ResponseDTO, UserResponseDTO } from '../models/user';
import { catchError, map, tap, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    http = inject(HttpClient);

    getAllStudents(start: number, perPage: number) {
        return this.http.post<ResponseDTO>('https://localhost:7113/admin/all-students', { start, perPage }).pipe(
            catchError((err) => {
                console.error(err);
                return throwError(() => err);
            })
        );
    }
}
