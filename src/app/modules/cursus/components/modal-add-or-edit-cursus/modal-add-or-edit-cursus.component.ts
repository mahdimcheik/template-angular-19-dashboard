import { Component, computed, inject, input, model, OnInit, output, signal } from '@angular/core';
import { Form, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
    isLoading = signal(false);
    formStructure!: Structure;

    messageService = inject(MessageService);
    cursusService = inject(CursusMainService);
    layoutService = inject(LayoutService);
    fb = inject(FormBuilder);

    levelsList = computed(() => this.cursusService.levels());

    categoriesList = computed(() => this.cursusService.categories());

    imgUrl = computed(() => (!this.layoutService.isDarkTheme() ? 'assets/skillHiveSecondaryBlack.svg' : 'assets/skillHiveSecondaryWhite.svg'));

    ngOnInit(): void {
        this.isLoading.set(true);

        if (this.updateOrAdd() === 'update' && this.cursusToChange()) {
            const cursus = this.cursusToChange()!;

            this.selectedLevel = this.levelsList().find((x) => x.id === cursus.levelId) ?? this.levelsList()[0];
            this.selectedCategory = this.categoriesList().find((x) => x.id === cursus.categoryId) ?? this.categoriesList()[0];

            this.formStructure = {
                id: 'cursus',
                name: 'cursus',
                label: 'Cours',
                description: 'Editer ce cours',
                icon: 'pi pi-book',
                imgUrl: this.imgUrl(),
                formFieldGroups: [
                    {
                        id: 'cursus',
                        name: 'cursus',
                        label: 'Cours',
                        description: 'Détails du cours',
                        fields: [
                            {
                                id: 'description',
                                name: 'description',
                                label: 'Description',
                                type: 'textarea',
                                placeholder: 'Description du cursus',
                                value: cursus.description ?? '',
                                required: true
                            },
                            {
                                id: 'name',
                                name: 'name',
                                label: 'Nom',
                                type: 'text',
                                placeholder: 'Nom du cursus',
                                value: cursus.name ?? '',
                                fullWidth: true,
                                required: true,
                                validation: [Validators.required, Validators.minLength(3), Validators.maxLength(100)]
                            },
                            {
                                id: 'level',
                                name: 'level',
                                label: 'Niveau',
                                type: 'select',
                                placeholder: 'Sélectionnez le niveau',
                                value: this.selectedLevel,
                                displayKey: 'name',
                                required: true,
                                options: this.levelsList(),
                                validation: [Validators.required]
                            },
                            {
                                id: 'category',
                                name: 'category',
                                label: 'Catégorie',
                                type: 'select',
                                placeholder: 'Sélectionnez la catégorie',
                                value: this.selectedCategory,
                                displayKey: 'name',
                                required: true,
                                options: this.categoriesList(),
                                validation: [Validators.required]
                            }
                        ]
                    }
                ]
            };
        } else {
            this.selectedLevel = this.levelsList()[0];
            this.selectedCategory = this.categoriesList()[0];

            this.formStructure = {
                id: 'cursus',
                name: 'Cours',
                label: 'Cours',
                description: 'Ajouter un nouveau cours',
                icon: 'pi pi-book',
                imgUrl: this.imgUrl(),

                formFieldGroups: [
                    {
                        id: 'cursus',
                        name: 'cursus',
                        label: 'Cours',
                        description: 'cursus',
                        order: 1,
                        fields: [
                            {
                                id: 'name',
                                name: 'name',
                                label: 'Nom',
                                type: 'text',
                                placeholder: 'Nom du cursus',
                                value: '',
                                required: true,
                                order: 1,
                                validation: [Validators.required, Validators.minLength(3), Validators.maxLength(100)]
                            },
                            {
                                id: 'description',
                                name: 'description',
                                label: 'Description',
                                type: 'textarea',
                                placeholder: 'Description du cursus',
                                value: '',
                                required: true,
                                order: 2
                            },

                            {
                                id: 'level',
                                name: 'level',
                                label: 'Niveau',
                                type: 'select',
                                displayKey: 'name',
                                placeholder: 'Sélectionnez le niveau',
                                value: this.levelsList()[0],
                                required: true,
                                options: this.levelsList(),
                                validation: [Validators.required],
                                order: 3
                            },
                            {
                                id: 'category',
                                name: 'category',
                                label: 'Catégorie',
                                type: 'select',
                                displayKey: 'name',
                                placeholder: 'Sélectionnez la catégorie',
                                value: this.categoriesList()[0],
                                required: true,
                                options: this.categoriesList(),
                                validation: [Validators.required],
                                order: 4
                            }
                        ]
                    }
                ]
            };
        }
    }

    close() {
        this.visibleRight.set(false);
        this.onClose.emit(false);
    }

    async submit(event: FormGroup<any>) {
        const formValue = event.value;
        if (event.valid) {
            try {
                this.visibleRight.set(false);

                if (this.updateOrAdd() === 'update' && this.cursusToChange()) {
                    const updateData: UpdateCursusDto = {
                        id: this.cursusToChange()?.id ?? '',
                        name: formValue.cursus.name,
                        description: formValue.cursus.description,
                        levelId: formValue.cursus.level.id,
                        categoryId: formValue.cursus.category.id
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
                        name: formValue.cursus.name,
                        description: formValue.cursus.description,
                        levelId: formValue.cursus.level.id,
                        categoryId: formValue.cursus.category.id
                    };

                    await firstValueFrom(this.cursusService.addCursus(createData));
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: 'Le cursus a été créé avec succès',
                        life: 3000
                    });
                }
            } catch (error) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: "Une erreur est survenue lors de l'opérations",
                    life: 3000
                });
            } finally {
                const res = await firstValueFrom(this.cursusService.getAllCursus(0, 10));
            }
        }
    }
}
