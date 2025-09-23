import { inject, Injectable, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { FormationService as GeneratedFormationService } from '../../api/services/FormationService';
import { FormationCreateDTO } from '../../api/models/FormationCreateDTO';
import { FormationResponseDTO } from '../../api/models/FormationResponseDTO';
import { FormationUpdateDTO } from '../../api/models/FormationUpdateDTO';
import { ResponseDTO } from './userMain.service';
/**
 * Service pour gérer les formations.
 * Fournit des méthodes pour récupérer, ajouter, mettre à jour et supprimer des formations via l'API.
 * Utilise FormationService généré par OpenAPI pour les appels API.
 * Stocke les formations dans un signal pour une réactivité facile dans les composants Angular.
 */
@Injectable({
    providedIn: 'root'
})
export class FormationMainService {
    private generatedFormationService = inject(GeneratedFormationService);
    formations = signal<FormationResponseDTO[]>([]);

    // si les formations apparteinnent à l'utilisateur connecté, on les met à jour dans le signal
    // sinon on ne fait rien, valable pour les autres fonctions aussi

    /**
     * Récupère les formations d'un utilisateur.
     * @param userId ID de l'utilisateur dont on veut les formations
     * @param forOwner Indique si les formations appartiennent à l'utilisateur connecté
     * @returns Un observable contenant la réponse de l'API
     */
    getFormations(userId: string, forOwner: boolean = true): Observable<ResponseDTO> {
        return this.generatedFormationService.getFormationAll(userId).pipe(
            map((response) => ({
                message: response.message || 'Success',
                status: response.status || 200,
                data: response.data || [],
                count: response.count || 0
            })),
            tap((res) => {
                if (forOwner) {
                    this.formations.set(res.data as FormationResponseDTO[]);
                }
            })
        );
    }

    /**
     * Ajoute une nouvelle formation.
     * @param formation Les données de la formation à ajouter
     * @param forOwner Indique si la formation appartient à l'utilisateur connecté
     * @returns Un observable contenant la réponse de l'API
     */
    addFormation(formation: FormationCreateDTO, forOwner: boolean = true): Observable<ResponseDTO> {
        return this.generatedFormationService.postFormation(formation).pipe(
            map((response) => ({
                message: response.message || 'Success',
                status: response.status || 201,
                data: response.data || null,
                count: response.count || 0
            })),
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

    /**
     * Met à jour une formation.
     * @param formation Les données de la formation à mettre à jour
     * @param forOwner Indique si la formation appartient à l'utilisateur connecté
     * @returns Un observable contenant la réponse de l'API
     */
    updateFormation(formation: FormationUpdateDTO, forOwner: boolean = true): Observable<ResponseDTO> {
        return this.generatedFormationService.putFormation(formation).pipe(
            map((response) => ({
                message: response.message || 'Success',
                status: response.status || 200,
                data: response.data || null,
                count: response.count || 0
            })),
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

    /**
     * Supprime une formation.
     * @param formationId ID de la formation à supprimer
     * @param forOwner Indique si la formation appartient à l'utilisateur connecté
     * @returns Un observable contenant la réponse de l'API
     */
    deleteFormation(formationId: string, forOwner: boolean = true): Observable<ResponseDTO> {
        return this.generatedFormationService.deleteFormation(formationId).pipe(
            map((response) => ({
                message: response.message || 'Success',
                status: response.status || 204,
                data: response.data || null,
                count: response.count || 0
            })),
            tap(() => {
                if (!forOwner) {
                    return;
                }
                this.formations.update((formations) => formations.filter((formation) => formation.id !== formationId));
            })
        );
    }
}
