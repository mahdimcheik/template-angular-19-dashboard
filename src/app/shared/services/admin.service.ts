import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ResponseDTO, UserResponseDTO } from '../models/user';
import { catchError, map, tap, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    allStudents = signal<UserResponseDTO[]>([]);

    http = inject(HttpClient);

    getAllStudents() {
        return this.http.get<UserResponseDTO[]>('https://localhost:7113/admin/all-students').pipe(
            catchError((err) => {
                console.error(err);
                return throwError(() => err);
            }),
            tap((res) => {
                this.allStudents.set(res);
            })
        );
    }
}
