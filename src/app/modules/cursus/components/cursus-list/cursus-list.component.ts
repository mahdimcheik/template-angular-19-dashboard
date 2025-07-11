import { AfterViewChecked, Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule, TablePageEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import { CursusLevelPipe, CursusLevelIconPipe } from '../../../../shared/pipes/cursus-level.pipe';
import { ModalAddOrEditCursusComponent } from '../modal-add-or-edit-cursus/modal-add-or-edit-cursus.component';
import { ModalConfirmDeleteCursusComponent } from '../modal-confirm-delete-cursus/modal-confirm-delete-cursus.component';
import { firstValueFrom } from 'rxjs';
import { PageEvent, UserMainService } from '../../../../shared/services/userMain.service';
import { CursusMainService } from '../../../../shared/services/cursus.service';
import { CursusDto, UpdateCursusDto } from '../../../../api';

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
        CursusLevelIconPipe,
        ModalAddOrEditCursusComponent,
        ModalConfirmDeleteCursusComponent
    ],
    templateUrl: './cursus-list.component.html',
    styleUrls: ['./cursus-list.component.scss']
})
export class CursusListComponent implements OnInit {
    @ViewChild('dt') dt!: Table;

    private cursusService = inject(CursusMainService);
    authService = inject(UserMainService);
    private router = inject(Router);

    cursus = this.cursusService.cursus;

    // Modal states
    visibleAddEdit = signal(false);
    visibleDelete = signal(false);

    // Selected cursus for operations
    selectedCursus = signal<CursusDto | null>(null);
    updateOrAdd = signal<'update' | 'add'>('add');

    // Pagination
    first = signal(0);
    pageSize = signal(10);
    totalItems = signal(0);

    ngOnInit() {
        this.loadCursus();
    }

    async loadCursus() {
        try {
            const res = await firstValueFrom(this.cursusService.getAllCursus(this.first(), this.pageSize()));
            this.totalItems.set(res.count ?? 0);
        } catch (error) {
            console.error('Error loading cursus:', error);
        }
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    onPageChange(event: TablePageEvent) {
        this.first.set(event.first);
        this.pageSize.set(event.rows);
        this.loadCursus();
    }

    formatDate(date: Date): string {
        return new Date(date).toLocaleDateString('fr-FR');
    }

    // Modal operations
    async openAddModal() {
        await this.getLevelsAndCategories();

        this.updateOrAdd.set('add');
        this.selectedCursus.set(null);
        this.visibleAddEdit.set(true);
    }

    async openEditModal(cursus: CursusDto) {
        await this.getLevelsAndCategories();

        this.updateOrAdd.set('update');
        this.selectedCursus.set(cursus);
        this.visibleAddEdit.set(true);
    }

    openDeleteModal(cursus: CursusDto) {
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
            try {
                await firstValueFrom(this.cursusService.deleteCursus(this.selectedCursus()?.id ?? ''));
                // Reload current page to maintain pagination state
                await this.loadCursus();
                this.closeDeleteModal();
            } catch (error) {
                console.error('Error deleting cursus:', error);
            }
        }
    }

    async onCursusUpdated() {
        if (this.selectedCursus()) {
            try {
                await firstValueFrom(this.cursusService.updateCursus(this.selectedCursus()! as UpdateCursusDto));
            } catch (error) {
                console.error('Error updating cursus:', error);
            } finally {
                this.closeAddEditModal();
            }
        } else {
            // This is an add operation, reload current page
            try {
                await this.loadCursus();
            } catch (error) {
                console.error('Error reloading cursus:', error);
            }
            this.closeAddEditModal();
        }
    }

    viewDetails(cursus: CursusDto) {
        this.router.navigate(['/cursus', cursus.id]);
    }

    async getLevelsAndCategories() {
        try {
            if (this.cursusService.levels().length === 0) {
                await firstValueFrom(this.cursusService.getCursusLevels());
            }
            if (this.cursusService.categories().length === 0) {
                await firstValueFrom(this.cursusService.getCursusCategories());
            }
        } finally {
        }
    }
}
