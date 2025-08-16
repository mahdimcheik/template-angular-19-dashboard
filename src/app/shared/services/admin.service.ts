import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { UserBanDTO } from '../../api';
import { catchError, map, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResponseDTO } from './userMain.service';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    http = inject(HttpClient);
    baseUrl = environment.BACK_URL;

    getAllStudents(start: number, perPage: number, searchWord?: string) {
        return this.http.post<ResponseDTO>(this.baseUrl + '/admin/all-students', { start, perPage, searchWord });
    }

    banUnbanUser(userBanDTO: UserBanDTO) {
        return this.http.put<ResponseDTO>(this.baseUrl + '/admin/ban-unban', userBanDTO);
    }
}
