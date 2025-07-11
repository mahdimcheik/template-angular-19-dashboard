import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { SkeletonModule } from 'primeng/skeleton';
import { CursusDTO } from '../../../../shared/models/cursus';
import { CursusService } from '../../../../shared/services/cursus.service';
import { CursusLevelPipe, CursusLevelBadgePipe, CursusLevelIconPipe } from '../../../../shared/pipes/cursus-level.pipe';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-cursus-detail',
    standalone: true,
    imports: [CommonModule, ButtonModule, CardModule, BadgeModule, SkeletonModule, CursusLevelPipe, CursusLevelBadgePipe, CursusLevelIconPipe],
    templateUrl: './cursus-detail.component.html',
    styleUrls: ['./cursus-detail.component.scss']
})
export class CursusDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private cursusService = inject(CursusService);

    cursus = signal<CursusDTO | null>(null);
    loading = signal(true);
    error = signal<string | null>(null);

    ngOnInit() {
        this.loadCursus();
    }

    async loadCursus() {
        try {
            this.loading.set(true);
            this.error.set(null);

            const id = this.route.snapshot.paramMap.get('id');
            if (!id) {
                this.error.set('ID du cursus non fourni');
                return;
            }

            const response = await firstValueFrom(this.cursusService.getCursusById(id));
            if (response.data) {
                this.cursus.set(response.data);
            } else {
                this.error.set('Cursus non trouvé');
            }
        } catch (error) {
            this.error.set('Erreur lors du chargement du cursus');
            console.error('Error loading cursus:', error);
        } finally {
            this.loading.set(false);
        }
    }

    goBack() {
        this.router.navigate(['/cursus']);
    }

    formatDate(date: Date): string {
        return new Date(date).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    editCursus() {
        // Navigate to edit mode - this would typically open the modal or navigate to edit page
        this.router.navigate(['/cursus', this.cursus()?.id, 'edit']);
    }
}
