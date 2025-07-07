import { Component, inject, input, model, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CursusDTO, CreateCursusDto, UpdateCursusDto, CursusLevel, CursusLevelDropDown, CursusCategoryDropDown } from '../../../../shared/models/cursus';
import { firstValueFrom } from 'rxjs';
import { CursusService } from '../../../../shared/services/cursus.service';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FluidModule } from 'primeng/fluid';
import { DrawerModule } from 'primeng/drawer';
import { TextareaModule } from 'primeng/textarea';
import { LayoutService } from '../../../../layout/service/layout.service';

@Component({
    selector: 'app-modal-add-or-edit-cursus',
    standalone: true,
    imports: [CommonModule, FormsModule, FluidModule, DrawerModule, DialogModule, SelectModule, ButtonModule, MessageModule, ReactiveFormsModule, InputTextModule, TextareaModule],
    templateUrl: './modal-add-or-edit-cursus.component.html',
    styleUrls: ['./modal-add-or-edit-cursus.component.scss']
})
export class ModalAddOrEditCursusComponent implements OnInit {
    visibleRight = model<boolean>(false);
    onClose = output<boolean>();
    cursusToChange = input<CursusDTO | null>(null);
    updateOrAdd = input<'update' | 'add'>('update');
    actionEmitter = output<void>();

    selectedLevel!: CursusLevelDropDown;
    selectedCategory!: CursusCategoryDropDown;
    title!: string;

    messageService = inject(MessageService);
    cursusService = inject(CursusService);
    layoutService = inject(LayoutService);
    fb = inject(FormBuilder);

    cursusForm!: FormGroup;

    levelsList: CursusLevelDropDown[] = [
        {
            id: '1',
            name: 'Débutant',
            value: CursusLevel.Beginner
        },
        {
            id: '2',
            name: 'Intermédiaire',
            value: CursusLevel.Intermediate
        },
        {
            id: '3',
            name: 'Avancé',
            value: CursusLevel.Advanced
        }
    ];

    categoriesList: CursusCategoryDropDown[] = [
        {
            id: '1',
            name: 'Développement Frontend',
            value: 'Frontend Development'
        },
        {
            id: '2',
            name: 'Développement Backend',
            value: 'Backend Development'
        },
        {
            id: '3',
            name: 'Langages de Programmation',
            value: 'Programming Languages'
        },
        {
            id: '4',
            name: 'Base de Données',
            value: 'Database'
        },
        {
            id: '5',
            name: 'DevOps',
            value: 'DevOps'
        },
        {
            id: '6',
            name: 'Design',
            value: 'Design'
        },
        {
            id: '7',
            name: 'Mobile',
            value: 'Mobile Development'
        },
        {
            id: '8',
            name: 'Intelligence Artificielle',
            value: 'AI & Machine Learning'
        }
    ];

    ngOnInit(): void {
        if (this.updateOrAdd() === 'update' && this.cursusToChange()) {
            this.title = 'Modifier le cursus';
            const cursus = this.cursusToChange()!;

            this.selectedLevel = this.levelsList.find((x) => x.value === cursus.level) ?? this.levelsList[0];
            this.selectedCategory = this.categoriesList.find((x) => x.value === cursus.category) ?? this.categoriesList[0];

            this.cursusForm = this.fb.group({
                name: [cursus.name, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
                description: [cursus.description, [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
                level: [this.selectedLevel, [Validators.required]],
                category: [this.selectedCategory, [Validators.required]]
            });
        } else {
            this.title = 'Ajouter un nouveau cursus';
            this.selectedLevel = this.levelsList[0];
            this.selectedCategory = this.categoriesList[0];

            this.cursusForm = this.fb.group({
                name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
                description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
                level: [this.selectedLevel, [Validators.required]],
                category: [this.selectedCategory, [Validators.required]]
            });
        }
    }

    close() {
        this.visibleRight.set(false);
        this.onClose.emit(false);
    }

    async submit() {
        if (this.cursusForm.valid) {
            try {
                this.visibleRight.set(false);

                if (this.updateOrAdd() === 'update' && this.cursusToChange()) {
                    const updateData: UpdateCursusDto = {
                        id: this.cursusToChange()!.id,
                        name: this.cursusForm.value.name,
                        description: this.cursusForm.value.description,
                        level: this.cursusForm.value.level.value,
                        category: this.cursusForm.value.category.value
                    };

                    await firstValueFrom(this.cursusService.updateCursus(updateData));
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: 'Le cursus a été modifié avec succès',
                        life: 3000
                    });
                } else {
                    const createData: CreateCursusDto = {
                        name: this.cursusForm.value.name,
                        description: this.cursusForm.value.description,
                        level: this.cursusForm.value.level.value,
                        category: this.cursusForm.value.category.value
                    };

                    await firstValueFrom(this.cursusService.addCursus(createData));
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: 'Le cursus a été créé avec succès',
                        life: 3000
                    });
                }

                this.actionEmitter.emit();
            } catch (error) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: "Une erreur est survenue lors de l'opération",
                    life: 3000
                });
            }
        }
    }

    getFieldError(fieldName: string): string | null {
        const field = this.cursusForm.get(fieldName);
        if (field && field.errors && field.touched) {
            if (field.errors['required']) {
                return 'Ce champ est requis';
            }
            if (field.errors['minlength']) {
                return `Minimum ${field.errors['minlength'].requiredLength} caractères`;
            }
            if (field.errors['maxlength']) {
                return `Maximum ${field.errors['maxlength'].requiredLength} caractères`;
            }
        }
        return null;
    }
}
