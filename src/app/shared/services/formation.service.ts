import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { Observable, switchMap, tap } from 'rxjs';
import { FormationCreateDTO, FormationResponseDTO, FormationUpdateDTO } from '../models/formation';
import { ResponseDTO } from '../models/user';
import { environment } from '../../../environments/environment.development';
@Injectable({
    providedIn: 'root'
})
export class FormationService {
    baseUrl = environment.BACK_URL;

    private http: HttpClient = inject(HttpClient);
    formations = signal<FormationResponseDTO[]>([]);

    getFormations(userId: string) {
        return this.http.get<ResponseDTO>(`${this.baseUrl}/formation/all?userId=${userId}`).pipe(
            tap((res) => {
                this.formations.set(res.data as FormationResponseDTO[]);
                return res;
            })
        );
    }

    addFormation(formation: FormationCreateDTO): Observable<ResponseDTO> {
        return this.http.post<ResponseDTO>(`${this.baseUrl}/formation`, formation).pipe(
            tap((res) => {
                this.formations.update((formations) => {
                    formations.push(res.data as FormationResponseDTO);
                    return formations;
                });
            })
        );
    }

    updateFormation(formation: FormationUpdateDTO): Observable<ResponseDTO> {
        return this.http.put<ResponseDTO>(`${this.baseUrl}/formation`, formation).pipe(
            tap((res) => {
                this.formations.update((formations) => {
                    const index = formations.findIndex((f) => f.id === formation.id);
                    if (index !== -1) {
                        formations[index] = { ...formations[index], ...formation };
                    }
                    return formations;
                });
                return res;
            })
        );
    }

    deleteFormation(formationId: string): Observable<ResponseDTO> {
        return this.http.delete<ResponseDTO>(`${this.baseUrl}/formation?formationId=${formationId}`).pipe(
            tap(() => {
                this.formations.update((formations) => formations.filter((formation) => formation.id !== formationId));
            })
        );
    }
}
