import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap, delay } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CursusService } from '../../api/services/CursusService';
import { CursusDtoIEnumerableResponseDTO } from '../../api/models/CursusDtoIEnumerableResponseDTO';
import { CursusDto } from '../../api/models/CursusDto';
import { CursusDtoResponseDTO } from '../../api/models/CursusDtoResponseDTO';
import { StringResponseDTO } from '../../api/models/StringResponseDTO';
import { CreateCursusDto } from '../../api/models/CreateCursusDto';
import { UpdateCursusDto } from '../../api/models/UpdateCursusDto';
import { Level } from '../../api/models/Level';
import { Category } from '../../api/models/Category';

/**
 * Service pour gérer les cursus.
 * Fournit des méthodes pour récupérer, ajouter, mettre à jour et supprimer des cursus via l'API.
 * Utilise CursusService généré par OpenAPI pour les appels API.
 * Stocke les cursus, niveaux et catégories dans des signaux pour une réactivité facile dans les composants Angular.
 */
@Injectable({
    providedIn: 'root'
})
export class CursusMainService {
    private http: HttpClient = inject(HttpClient);
    private cursusService = inject(CursusService);
    baseUrl = environment.BACK_URL;

    cursus = signal([] as CursusDto[]);

    levels = signal([] as Level[]);
    categories = signal([] as Category[]);

    // Store current pagination state
    private currentStart = 0;
    private currentPerPage = 10;

    /**
     * Récupère la liste des catégories de cursus.
     * @returns Un observable contenant la liste des catégories de cursus
     */
    getCursusCategories() {
        return this.cursusService.getCursusCategories().pipe(
            tap((res) => {
                this.categories.set(res.data ?? []);
            })
        );
    }

    /**
     * Récupère la liste des niveaux de cursus.
     * @returns Un observable contenant la liste des niveaux de cursus
     */
    getCursusLevels() {
        return this.cursusService.getCursusLevels().pipe(
            tap((res) => {
                this.levels.set(res.data ?? []);
            })
        );
    }

    /**
     * Récupère tous les cursus avec pagination.
     * @param start L'index de départ pour la pagination
     * @param perPage Le nombre de cursus à récupérer par page
     * @returns Un observable contenant la liste des cursus
     */
    getAllCursus(start: number, perPage: number): Observable<CursusDtoIEnumerableResponseDTO> {
        this.currentStart = start;
        this.currentPerPage = perPage;

        return this.cursusService
            .postCursusAll({
                start: start,
                perPage: perPage
            })
            .pipe(
                tap((res) => {
                    this.cursus.set(res.data ?? []);
                })
            );
    }

    /**
     * Recharge la page actuelle de cursus en utilisant les paramètres de pagination stockés.
     * Utile après une opération de mise à jour, d'ajout ou de suppression pour rafraîchir la liste.
     * @returns Un observable contenant la liste des cursus
     */
    reloadCurrentPage(): Observable<CursusDtoIEnumerableResponseDTO> {
        return this.getAllCursus(this.currentStart, this.currentPerPage);
    }

    /**
     * Met à jour un cursus existant.
     * @param cursusDTO Les données du cursus à mettre à jour
     * @returns Un observable contenant la réponse de l'API
     */
    updateCursus(cursusDTO: UpdateCursusDto): Observable<CursusDtoResponseDTO> {
        return this.cursusService.putCursus(cursusDTO.id!, cursusDTO).pipe(
            delay(500),
            tap((res) => {
                const cursusIndex = this.cursus().findIndex((x) => x.id === cursusDTO.id);
                if (cursusIndex !== -1) {
                    this.cursus()[cursusIndex] = res.data as CursusDto;
                    this.cursus.update((oldList) => [...oldList]);
                }
            })
        );
    }

    /**
     * Ajoute un nouveau cursus.
     * @param cursusDTO Les données du cursus à ajouter
     * @returns Un observable contenant la réponse de l'API
     */
    addCursus(cursusDTO: CreateCursusDto): Observable<CursusDtoResponseDTO> {
        return this.cursusService.postCursus(cursusDTO).pipe(delay(500));
    }

    /**
     * Supprime un cursus.
     * @param cursusId L'ID du cursus à supprimer
     * @returns Un observable contenant la réponse de l'API
     */
    deleteCursus(cursusId: string): Observable<StringResponseDTO> {
        return this.cursusService.deleteCursus(cursusId).pipe(delay(500));
    }
}
