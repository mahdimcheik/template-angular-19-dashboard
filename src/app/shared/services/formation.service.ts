import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { Observable, tap } from 'rxjs';
import { FormationCreateDTO, FormationResponseDTO, FormationUpdateDTO } from '../models/formation';
import { ResponseDTO } from '../models/user';
import { environment } from '../../../environments/environment.development';
@Injectable({
    providedIn: 'root'
})
export class FormationService {
    baseUrl = environment.BACK_URL;

    private http: HttpClient = inject(HttpClient);

    getFormations(userId: string) {
        return this.http.get<ResponseDTO>(`${this.baseUrl}/formation/all?userId=${userId}`);
    }

    addFormation(formation: FormationCreateDTO): Observable<ResponseDTO> {
        return this.http.post<ResponseDTO>(`${this.baseUrl}/formation`, formation);
    }

    updateFormation(formation: FormationUpdateDTO): Observable<ResponseDTO> {
        return this.http.put<ResponseDTO>(`${this.baseUrl}/formation`, formation);
    }

    deleteFormation(formationId: string): Observable<ResponseDTO> {
        return this.http.delete<ResponseDTO>(`${this.baseUrl}/formation?formationId=${formationId}`);
    }
}
