import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap, of, delay } from 'rxjs';
import { CursusDTO, CreateCursusDto, UpdateCursusDto } from '../models/cursus';
import { HttpClient } from '@angular/common/http';
import { ResponseDTO } from '../models/user';
import { environment } from '../../../environments/environment.development';

@Injectable({
    providedIn: 'root'
})
export class CursusService {
    private http: HttpClient = inject(HttpClient);
    baseUrl = environment.BACK_URL;

    cursus = signal([] as CursusDTO[]);

    // Mock data for development
    private mockCursus: CursusDTO[] = [
        {
            id: '1',
            name: 'Introduction to Angular',
            description: 'Learn the basics of Angular framework, including components, services, and routing.',
            level: 'beginner',
            category: 'Frontend Development',
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-01-15')
        },
        {
            id: '2',
            name: 'Advanced TypeScript',
            description: 'Master advanced TypeScript concepts including generics, decorators, and advanced types.',
            level: 'advanced',
            category: 'Programming Languages',
            createdAt: new Date('2024-01-20'),
            updatedAt: new Date('2024-01-20')
        },
        {
            id: '3',
            name: 'React Fundamentals',
            description: 'Understand React concepts including hooks, state management, and component lifecycle.',
            level: 'intermediate',
            category: 'Frontend Development',
            createdAt: new Date('2024-01-25'),
            updatedAt: new Date('2024-01-25')
        },
        {
            id: '4',
            name: 'Node.js Backend Development',
            description: 'Build robust backend applications using Node.js, Express, and MongoDB.',
            level: 'intermediate',
            category: 'Backend Development',
            createdAt: new Date('2024-02-01'),
            updatedAt: new Date('2024-02-01')
        },
        {
            id: '5',
            name: 'Python for Beginners',
            description: 'Start your programming journey with Python, covering syntax, data structures, and basic algorithms.',
            level: 'beginner',
            category: 'Programming Languages',
            createdAt: new Date('2024-02-05'),
            updatedAt: new Date('2024-02-05')
        }
    ];

    constructor() {
        // Initialize with mock data
        this.cursus.set(this.mockCursus);
    }

    getAllCursus(): Observable<ResponseDTO> {
        // For now, return mock data. In production, use HTTP call:
        // return this.http.get<ResponseDTO>(`${this.baseUrl}/cursus`).pipe(
        //     tap((res) => {
        //         this.cursus.set(res.data as CursusDTO[]);
        //     })
        // );

        return of({
            message: 'Success',
            status: 200,
            data: this.mockCursus,
            count: this.mockCursus.length
        }).pipe(
            delay(500), // Simulate network delay
            tap((res) => {
                this.cursus.set(res.data as CursusDTO[]);
            })
        );
    }

    getCursusById(cursusId: string): Observable<ResponseDTO> {
        const cursus = this.mockCursus.find((c) => c.id === cursusId);
        return of({
            message: 'Success',
            status: 200,
            data: cursus
        }).pipe(delay(300));
    }

    updateCursus(cursusDTO: UpdateCursusDto): Observable<ResponseDTO> {
        // In production: return this.http.put<ResponseDTO>(`${this.baseUrl}/cursus`, cursusDTO).pipe(

        return of({
            message: 'Cursus updated successfully',
            status: 200,
            data: { ...cursusDTO, updatedAt: new Date() }
        }).pipe(
            delay(500),
            tap((res) => {
                const cursusIndex = this.cursus().findIndex((x) => x.id === cursusDTO.id);
                if (cursusIndex !== -1) {
                    this.cursus()[cursusIndex] = { ...this.cursus()[cursusIndex], ...cursusDTO, updatedAt: new Date() };
                    this.cursus.update((oldList) => [...oldList]);
                }
            })
        );
    }

    addCursus(cursusDTO: CreateCursusDto): Observable<ResponseDTO> {
        // In production: return this.http.post<ResponseDTO>(`${this.baseUrl}/cursus`, cursusDTO).pipe(

        const newCursus: CursusDTO = {
            id: (this.cursus().length + 1).toString(),
            ...cursusDTO,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        return of({
            message: 'Cursus created successfully',
            status: 201,
            data: newCursus
        }).pipe(
            delay(500),
            tap((res) => {
                this.cursus.update((oldList) => [...oldList, res.data as CursusDTO]);
            })
        );
    }

    deleteCursus(cursusId: string): Observable<ResponseDTO> {
        // In production: return this.http.delete<ResponseDTO>(`${this.baseUrl}/cursus?cursusId=${cursusId}`).pipe(

        return of({
            message: 'Cursus deleted successfully',
            status: 204
        }).pipe(
            delay(500),
            tap((res) => {
                if (res.status === 204) {
                    this.cursus.update((oldList) => oldList.filter((x) => x.id !== cursusId));
                }
            })
        );
    }
}
