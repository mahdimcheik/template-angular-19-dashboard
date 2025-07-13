import { Component, computed, inject, input, model, OnInit, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
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
import { CursusDto } from '../../../../api/models/CursusDto';
import { CursusMainService } from '../../../../shared/services/cursus.service';
import { Level } from '../../../../api/models/Level';
import { Category } from '../../../../api/models/Category';
import { UpdateCursusDto } from '../../../../api/models/UpdateCursusDto';
import { CreateCursusDto } from '../../../../api';
import { Structure } from '../../../../generic-components/configurable-form/related-models';
import { ConfigurableFormComponent } from '../../../../generic-components/configurable-form/configurable-form.component';

@Component({
    selector: 'app-modal-add-or-edit-cursus',
    standalone: true,
    imports: [CommonModule, FormsModule, ConfigurableFormComponent, FluidModule, DrawerModule, DialogModule, SelectModule, ButtonModule, MessageModule, ReactiveFormsModule, InputTextModule, TextareaModule],
    templateUrl: './modal-add-or-edit-cursus.component.html',
    styleUrls: ['./modal-add-or-edit-cursus.component.scss']
})
export class ModalAddOrEditCursusComponent implements OnInit {
    visibleRight = model<boolean>(false);
    onClose = output<boolean>();
    cursusToChange = input<CursusDto | null>(null);
    updateOrAdd = input<'update' | 'add'>('update');
    actionEmitter = output<void>();

    selectedLevel!: Level;
    selectedCategory!: Category;
    title!: string;
    isLoading = signal(false);
    formStructure!: Structure;

    messageService = inject(MessageService);
    cursusService = inject(CursusMainService);
    layoutService = inject(LayoutService);
    fb = inject(FormBuilder);

    cursusForm!: FormGroup;

    levelsList = computed(() => this.cursusService.levels());

    categoriesList = computed(() => this.cursusService.categories());

    ngOnInit(): void {
        this.isLoading.set(true);
        // this.getLevelsAndCategories();

        if (this.updateOrAdd() === 'update' && this.cursusToChange()) {
            this.title = 'Modifier le cursus';
            const cursus = this.cursusToChange()!;

            this.selectedLevel = this.levelsList().find((x) => x.id === cursus.levelId) ?? this.levelsList()[0];
            this.selectedCategory = this.categoriesList().find((x) => x.id === cursus.categoryId) ?? this.categoriesList()[0];

            this.cursusForm = this.fb.group({
                name: [cursus.name, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
                description: [cursus.description, [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
                level: [this.selectedLevel, [Validators.required]],
                category: [this.selectedCategory, [Validators.required]]
            });

            this.formStructure = {
                id: 'cursus',
                name: 'cursus',
                description: 'cursus',
                icon: 'pi pi-book',
                formFieldGroups: [
                    {
                        id: 'cursus',
                        name: 'cursus',
                        description: 'cursus',
                        fields: [
                            {
                                id: 'name',
                                name: 'name',
                                label: 'Nom',
                                type: 'text',
                                placeholder: 'Nom du cursus',
                                required: true,
                                validation: [Validators.required, Validators.minLength(3), Validators.maxLength(100)]
                            },
                            {
                                id: 'description',
                                name: 'description',
                                label: 'Description',
                                type: 'textarea',
                                placeholder: 'Description du cursus',
                                required: true
                            }
                        ]
                    }
                ]
            };
        } else {
            this.title = 'Ajouter un nouveau cursus';
            this.selectedLevel = this.levelsList()[0];
            this.selectedCategory = this.categoriesList()[0];

            this.cursusForm = this.fb.group({
                name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
                description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
                level: [this.selectedLevel, [Validators.required]],
                category: [this.selectedCategory, [Validators.required]]
            });
        }
    }

    // async getLevelsAndCategories() {
    //     await firstValueFrom(this.cursusService.getCursusLevels());
    //     await firstValueFrom(this.cursusService.getCursusCategories());
    //     this.cursusForm.patchValue({
    //         level: this.selectedLevel,
    //         category: this.selectedCategory
    //     });
    //     this.isLoading.set(false);
    // }

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
                        id: this.cursusToChange()?.id ?? '',
                        name: this.cursusForm.value.name,
                        description: this.cursusForm.value.description,
                        levelId: this.cursusForm.value.level.id,
                        categoryId: this.cursusForm.value.category.id
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
                        levelId: this.cursusForm.value.level.id,
                        categoryId: this.cursusForm.value.category.id
                    };

                    console.log('createData', createData);

                    await firstValueFrom(this.cursusService.addCursus(createData));
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: 'Le cursus a été créé avec succès',
                        life: 3000
                    });
                }

                // this.actionEmitter.emit();
            } catch (error) {
                console.log('error', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: "Une erreur est survenue lors de l'opérations",
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
