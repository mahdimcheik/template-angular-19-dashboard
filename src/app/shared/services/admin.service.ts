import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { UserBanDTO } from '../../api';
import { catchError, map, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResponseDTO } from './userMain.service';
/**
 * Service pour les opérations administratives.
 * Fournit des méthodes pour gérer les utilisateurs via l'API.
 * Ce service est destiné aux administrateurs.
 * Utilise HttpClient pour les appels API.
 */
@Injectable({
    providedIn: 'root'
})
export class AdminService {
    http = inject(HttpClient);
    baseUrl = environment.BACK_URL;
    /**
     * Récupère la liste des étudiants.
     * @param start L'index de départ pour la pagination
     * @param perPage Le nombre d'étudiants à récupérer par page
     * @param searchWord Un mot-clé pour filtrer les résultats (facultatif)
     * @returns Un observable contenant la liste des étudiants
     */
    getAllStudents(start: number, perPage: number, searchWord?: string) {
        return this.http.post<ResponseDTO>(this.baseUrl + '/admin/all-students', { start, perPage, searchWord });
    }

    /**
     * Banni ou débanni un utilisateur.
     * @param userBanDTO Les données pour bannir ou débannir un utilisateur
     * @returns Un observable contenant la réponse de l'API
     */
    banUnbanUser(userBanDTO: UserBanDTO) {
        return this.http.put<ResponseDTO>(this.baseUrl + '/admin/ban-unban', userBanDTO);
    }
}
