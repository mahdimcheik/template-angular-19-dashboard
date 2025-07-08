import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap, delay } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { CursusService } from '../../api/services/CursusService';
import { CursusDtoIEnumerableResponseDTO } from '../../api/models/CursusDtoIEnumerableResponseDTO';
import { CursusDto } from '../../api/models/CursusDto';
import { CursusDtoResponseDTO } from '../../api/models/CursusDtoResponseDTO';
import { StringResponseDTO } from '../../api/models/StringResponseDTO';
import { CreateCursusDto } from '../../api/models/CreateCursusDto';
import { UpdateCursusDto } from '../../api/models/UpdateCursusDto';
import { Level } from '../../api/models/Level';
import { Category } from '../../api/models/Category';

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

    getCursusCategories() {
        return this.cursusService.getCursusCategories().pipe(
            tap((res) => {
                this.categories.set(res.data ?? []);
            })
        );
    }

    getCursusLevels() {
        return this.cursusService.getCursusLevels().pipe(
            tap((res) => {
                this.levels.set(res.data ?? []);
            })
        );
    }

    getAllCursus(): Observable<CursusDtoIEnumerableResponseDTO> {
        return this.cursusService.getCursus().pipe(
            tap((res) => {
                this.cursus.set(res.data ?? []);
            })
        );
    }

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

    addCursus(cursusDTO: CreateCursusDto): Observable<CursusDtoResponseDTO> {
        return this.cursusService.postCursus(cursusDTO).pipe(
            delay(500),
            tap((res) => {
                this.cursus.update((oldList) => [...oldList, res.data as CursusDto]);
            })
        );
    }

    deleteCursus(cursusId: string): Observable<StringResponseDTO> {
        return this.cursusService.deleteCursus(cursusId).pipe(
            delay(500),
            tap((res) => {
                this.cursus.update((oldList) => oldList.filter((x) => x.id !== cursusId));
            })
        );
    }
}
