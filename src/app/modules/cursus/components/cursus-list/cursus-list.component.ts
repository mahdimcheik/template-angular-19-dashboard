import { Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import { CursusDTO } from '../../../../shared/models/cursus';
import { CursusService } from '../../../../shared/services/cursus.service';
import { CursusLevelPipe, CursusLevelBadgePipe, CursusLevelIconPipe } from '../../../../shared/pipes/cursus-level.pipe';
import { ModalAddOrEditCursusComponent } from '../modal-add-or-edit-cursus/modal-add-or-edit-cursus.component';
import { ModalConfirmDeleteCursusComponent } from '../modal-confirm-delete-cursus/modal-confirm-delete-cursus.component';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
    selector: 'app-cursus-list',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        PaginatorModule,
        BadgeModule,
        TooltipModule,
        IconFieldModule,
        InputIconModule,
        CursusLevelPipe,
        CursusLevelBadgePipe,
        CursusLevelIconPipe,
        ModalAddOrEditCursusComponent,
        ModalConfirmDeleteCursusComponent
    ],
    templateUrl: './cursus-list.component.html',
    styleUrls: ['./cursus-list.component.scss']
})
export class CursusListComponent implements OnInit {
    @ViewChild('dt') dt!: Table;

    private cursusService = inject(CursusService);
    authService = inject(AuthService);
    private router = inject(Router);

    cursus = this.cursusService.cursus;
    loading = signal(false);

    // Modal states
    visibleAddEdit = signal(false);
    visibleDelete = signal(false);

    // Selected cursus for operations
    selectedCursus = signal<CursusDTO | null>(null);
    updateOrAdd = signal<'update' | 'add'>('add');

    ngOnInit() {
        this.loadCursus();
    }

    async loadCursus() {
        this.loading.set(true);
        try {
            await firstValueFrom(this.cursusService.getAllCursus());
        } finally {
            this.loading.set(false);
        }
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    formatDate(date: Date): string {
        return new Date(date).toLocaleDateString('fr-FR');
    }

    // Modal operations
    openAddModal() {
        this.updateOrAdd.set('add');
        this.selectedCursus.set(null);
        this.visibleAddEdit.set(true);
    }

    openEditModal(cursus: CursusDTO) {
        this.updateOrAdd.set('update');
        this.selectedCursus.set(cursus);
        this.visibleAddEdit.set(true);
    }

    openDeleteModal(cursus: CursusDTO) {
        this.selectedCursus.set(cursus);
        this.visibleDelete.set(true);
    }

    closeAddEditModal() {
        this.visibleAddEdit.set(false);
        this.selectedCursus.set(null);
    }

    closeDeleteModal() {
        this.visibleDelete.set(false);
        this.selectedCursus.set(null);
    }

    async onDeleteConfirmed() {
        if (this.selectedCursus()) {
            this.loading.set(true);
            try {
                await firstValueFrom(this.cursusService.deleteCursus(this.selectedCursus()!.id));
                this.closeDeleteModal();
            } finally {
                this.loading.set(false);
            }
        }
    }

    onCursusUpdated() {
        this.loadCursus();
        this.closeAddEditModal();
    }

    viewDetails(cursus: CursusDTO) {
        this.router.navigate(['/cursus', cursus.id]);
    }
}
