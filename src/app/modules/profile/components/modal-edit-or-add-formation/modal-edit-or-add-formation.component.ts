import { Component, computed, inject, input, model, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { FormationResponseDTO } from '../../../../api/models/FormationResponseDTO';
import { FormationCreateDTO } from '../../../../api/models/FormationCreateDTO';
import { FormationUpdateDTO } from '../../../../api/models/FormationUpdateDTO';
import { firstValueFrom } from 'rxjs';
import { FormationMainService } from '../../../../shared/services/formationMain.service';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { MessageModule } from 'primeng/message';
import { DrawerModule } from 'primeng/drawer';
import { FluidModule } from 'primeng/fluid';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { LayoutService } from '../../../../layout/service/layout.service';
import { Structure } from '../../../../generic-components/configurable-form/related-models';
import { ConfigurableFormComponent } from '../../../../generic-components/configurable-form/configurable-form.component';

@Component({
    selector: 'app-modal-edit-or-add-formation',
    imports: [ButtonModule, ConfigurableFormComponent, CommonModule, ReactiveFormsModule, MessageModule, DrawerModule, FluidModule, DatePickerModule, InputTextModule],
    templateUrl: './modal-edit-or-add-formation.component.html',
    styleUrl: './modal-edit-or-add-formation.component.scss'
})
export class ModalEditOrAddFormationComponent implements OnInit {
    visibleRight = model<boolean>(false);
    onClose = output<boolean>();
    formationToEdit = input<FormationResponseDTO>({} as FormationResponseDTO);
    formationService = inject(FormationMainService);
    updateOrAdd = input<'update' | 'add'>('update');
    actionEmitter = output<void>();
    messageService = inject(MessageService);
    layoutService = inject(LayoutService);

    fb = inject(FormBuilder);
    userForm!: FormGroup;
    formationStructure!: Structure;
    imgUrl = computed(() => (!this.layoutService.isDarkTheme() ? 'assets/skillHiveSecondaryBlack.svg' : 'assets/skillHiveSecondaryWhite.svg'));

    title = computed(() => (this.updateOrAdd() == 'update' ? 'Editer la formation suivante' : 'Ajouter une nouvelle formation'));

    ngOnInit(): void {
        console.log('formationToEdit ' + this.formationToEdit());

        if (this.updateOrAdd() == 'update') {
            this.formationStructure = {
                id: 'formation',
                name: 'formation',
                label: 'Formation',
                description: this.title(),
                imgUrl: this.imgUrl(),
                formFieldGroups: [
                    {
                        id: 'formation',
                        name: 'formation',
                        description: 'Formation',
                        fields: [
                            {
                                id: 'title',
                                name: 'title',
                                label: 'Titre',
                                type: 'text',
                                placeholder: 'Titre',
                                required: true,
                                value: this.formationToEdit().title,
                                order: 1
                            },
                            {
                                id: 'company',
                                name: 'company',
                                label: 'Entreprise',
                                type: 'text',
                                placeholder: 'Entreprise',
                                required: true,
                                value: this.formationToEdit().company,
                                order: 2
                            },
                            {
                                id: 'city',
                                name: 'city',
                                label: 'Ville',
                                type: 'text',
                                placeholder: 'Ville',
                                required: true,
                                value: this.formationToEdit().city,
                                order: 3
                            },
                            {
                                id: 'country',
                                name: 'country',
                                label: 'Pays',
                                type: 'text',
                                placeholder: 'Pays',
                                required: true,
                                value: this.formationToEdit().country,
                                order: 4
                            },
                            {
                                id: 'startAt',
                                name: 'startAt',
                                label: 'Date de début',
                                type: 'date',
                                placeholder: 'Date de début',
                                required: true,
                                value: new Date(this.formationToEdit().startAt ?? ''),
                                order: 5
                            },
                            {
                                id: 'endAt',
                                name: 'endAt',
                                label: 'Date de fin',
                                type: 'date',
                                placeholder: 'Date de fin',
                                required: true,
                                value: new Date(this.formationToEdit().endAt ?? ''),
                                order: 6
                            }
                        ]
                    }
                ]
            };
        } else if (this.updateOrAdd() == 'add') {
            this.formationStructure = {
                id: 'formation',
                name: 'formation',
                label: 'Formation',
                description: this.title(),
                imgUrl: this.imgUrl(),
                formFieldGroups: [
                    {
                        id: 'formation',
                        name: 'formation',
                        description: 'Formation',
                        fields: [
                            {
                                id: 'title',
                                name: 'title',
                                label: 'Titre',
                                type: 'text',
                                placeholder: 'Titre',
                                required: true,
                                order: 1
                            },
                            {
                                id: 'company',
                                name: 'company',
                                label: 'Entreprise',
                                type: 'text',
                                placeholder: 'Entreprise',
                                required: true,
                                order: 2
                            },
                            {
                                id: 'city',
                                name: 'city',
                                label: 'Ville',
                                type: 'text',
                                placeholder: 'Ville',
                                required: true,
                                order: 3
                            },
                            {
                                id: 'country',
                                name: 'country',
                                label: 'Pays',
                                type: 'text',
                                placeholder: 'Pays',
                                required: true,
                                order: 4
                            },
                            {
                                id: 'startAt',
                                name: 'startAt',
                                label: 'Date de début',
                                type: 'date',
                                placeholder: 'Date de début',
                                required: true,
                                order: 5
                            },
                            {
                                id: 'endAt',
                                name: 'endAt',
                                label: 'Date de fin',
                                type: 'date',
                                placeholder: 'Date de fin',
                                required: true,
                                order: 6
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
        const formFormation = event.value.formation;

        if (this.updateOrAdd() == 'update') {
            const newFormation: FormationUpdateDTO = {
                id: this.formationToEdit().id!,
                title: formFormation.title,
                company: formFormation.company,
                city: formFormation.city,
                country: formFormation.country,
                startAt: formFormation.startAt ? formFormation.startAt.toISOString() : '',
                endAt: formFormation.endAt ? formFormation.endAt.toISOString() : ''
            };

            await firstValueFrom(this.formationService.updateFormation(newFormation));
        } else if (this.updateOrAdd() == 'add') {
            const newFormation: FormationCreateDTO = {
                title: formFormation.title,
                company: formFormation.company,
                city: formFormation.city,
                country: formFormation.country,
                startAt: formFormation.startAt ? formFormation.startAt.toISOString() : '',
                endAt: formFormation.endAt ? formFormation.endAt.toISOString() : ''
            };
            await firstValueFrom(this.formationService.addFormation(newFormation));
        }
        this.visibleRight.set(false);
    }
}
