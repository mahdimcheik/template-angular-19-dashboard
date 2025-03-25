import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { Observable, tap } from 'rxjs';
import { FormationCreateDTO, FormationResponseDTO, FormationUpdateDTO } from '../models/formation';
import { ResponseDTO } from '../models/user';
@Injectable({
    providedIn: 'root'
})
export class FormationService {
    private http: HttpClient = inject(HttpClient);
    constructor() {}

    getFormations(userId: string) {
        return this.http.get<ResponseDTO>(`https://localhost:7113/formation/all?userId=${userId}`);
    }

    addFormation(formation: FormationCreateDTO): Observable<ResponseDTO> {
        return this.http.post<ResponseDTO>(`https://localhost:7113/formation`, formation);
    }

    updateFormation(formation: FormationUpdateDTO): Observable<ResponseDTO> {
        return this.http.put<ResponseDTO>(`https://localhost:7113/formation`, formation);
    }

    deleteFormation(formationId: string): Observable<ResponseDTO> {
        return this.http.delete<ResponseDTO>(`https://localhost:7113/formation?formationId=${formationId}`);
    }
}
