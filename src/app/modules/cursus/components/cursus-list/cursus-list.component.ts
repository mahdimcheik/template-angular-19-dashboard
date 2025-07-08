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
import { CursusLevelPipe, CursusLevelIconPipe } from '../../../../shared/pipes/cursus-level.pipe';
import { ModalAddOrEditCursusComponent } from '../modal-add-or-edit-cursus/modal-add-or-edit-cursus.component';
import { ModalConfirmDeleteCursusComponent } from '../modal-confirm-delete-cursus/modal-confirm-delete-cursus.component';
import { firstValueFrom } from 'rxjs';
import { UserMainService } from '../../../../shared/services/userMain.service';
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

    ngOnInit() {
        this.loadCursus();
    }

    async loadCursus() {
        try {
            await firstValueFrom(this.cursusService.getAllCursus());
        } finally {
        }
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
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

                this.closeDeleteModal();
            } finally {
            }
        }
    }

    async onCursusUpdated() {
        if (this.selectedCursus()) {
            try {
                await firstValueFrom(this.cursusService.updateCursus(this.selectedCursus()! as UpdateCursusDto));
            } finally {
                this.closeAddEditModal();
            }
        } else {
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
