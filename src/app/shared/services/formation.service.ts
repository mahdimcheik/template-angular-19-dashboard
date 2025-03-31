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

    // si les formations apparteinnent à l'utilisateur connecté, on les met à jour dans le signal
    // sinon on ne fait rien, valable pour les autres fonctions aussi
    getFormations(userId: string, forOwner: boolean = true): Observable<ResponseDTO> {
        return this.http.get<ResponseDTO>(`${this.baseUrl}/formation/all?userId=${userId}`).pipe(
            tap((res) => {
                if (forOwner) {
                    this.formations.set(res.data as FormationResponseDTO[]);
                }
            })
        );
    }

    addFormation(formation: FormationCreateDTO, forOwner: boolean = true): Observable<ResponseDTO> {
        return this.http.post<ResponseDTO>(`${this.baseUrl}/formation`, formation).pipe(
            tap((res) => {
                if (!forOwner) {
                    return;
                }
                this.formations.update((formations) => {
                    formations.push(res.data as FormationResponseDTO);
                    return formations;
                });
            })
        );
    }

    updateFormation(formation: FormationUpdateDTO, forOwner: boolean = true): Observable<ResponseDTO> {
        return this.http.put<ResponseDTO>(`${this.baseUrl}/formation`, formation).pipe(
            tap((res) => {
                if (!forOwner) {
                    return;
                }
                this.formations.update((formations) => {
                    const index = formations.findIndex((f) => f.id === formation.id);
                    if (index !== -1) {
                        formations[index] = { ...formations[index], ...formation };
                    }
                    return formations;
                });
            })
        );
    }

    deleteFormation(formationId: string, forOwner: boolean = true): Observable<ResponseDTO> {
        return this.http.delete<ResponseDTO>(`${this.baseUrl}/formation?formationId=${formationId}`).pipe(
            tap(() => {
                if (!forOwner) {
                    return;
                }
                this.formations.update((formations) => formations.filter((formation) => formation.id !== formationId));
            })
        );
    }
}
