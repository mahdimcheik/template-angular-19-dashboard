import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AdminService as GeneratedAdminService } from '../../api/services/AdminService';
import { QueryPagination } from '../../api/models/QueryPagination';
import { UserBanDTO } from '../../api/models/UserBanDTO';
import { ResponseDTO } from './userMain.service';

// Type aliases for backward compatibility
export type { UserBanDTO };

@Injectable({
    providedIn: 'root'
})
export class AdminMainService {
    private generatedAdminService = inject(GeneratedAdminService);

    getAllStudents(start: number, perPage: number, searchWord?: string): Observable<ResponseDTO> {
        const query: QueryPagination = {
            start,
            perPage,
            searchWord: searchWord
        };

        return this.generatedAdminService.postAdminAllStudents(query).pipe(
            map((response) => ({
                message: response.message || 'Success',
                status: response.status || 200,
                data: response.data || [],
                count: response.count || 0
            }))
        );
    }

    banUnbanUser(userBanDTO: UserBanDTO): Observable<ResponseDTO> {
        return this.generatedAdminService.putAdminBanUnban(userBanDTO).pipe(
            map((response) => ({
                message: response.message || 'Success',
                status: response.status || 200,
                data: response.data || {},
                count: response.count || 0
            }))
        );
    }
}
