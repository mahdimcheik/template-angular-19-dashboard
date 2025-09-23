import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AdminService as GeneratedAdminService } from '../../api/services/AdminService';
import { QueryPagination } from '../../api/models/QueryPagination';
import { UserBanDTO } from '../../api/models/UserBanDTO';
import { ResponseDTO } from './userMain.service';

// Type aliases for backward compatibility
export type { UserBanDTO };

/**
 * Service pour les opérations administratives.
 * Fournit des méthodes pour gérer les utilisateurs via l'API.
 * Ce service est destiné aux administrateurs.
 * Utilise HttpClient pour les appels API.
 */
@Injectable({
    providedIn: 'root'
})
export class AdminMainService {
    private generatedAdminService = inject(GeneratedAdminService);

    /**
     * Récupère la liste des étudiants.
     * @param start L'index de départ pour la pagination
     * @param perPage Le nombre d'étudiants à récupérer par page
     * @param searchWord Un mot-clé pour filtrer les résultats (facultatif)
     * @returns Un observable contenant la liste des étudiants
     */
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
/**
 * Banni ou débanni un utilisateur.
 * @param userBanDTO Les données pour bannir ou débannir un utilisateur
 * @returns Un observable contenant la réponse de l'API
 */
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
