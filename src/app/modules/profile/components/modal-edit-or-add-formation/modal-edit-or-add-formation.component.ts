import { Component, inject, input, model, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { FormationResponseDTO } from '../../../../shared/models/formation';
import { firstValueFrom } from 'rxjs';
import { FormationService } from '../../../../shared/services/formation.service';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { MessageModule } from 'primeng/message';
import { DrawerModule } from 'primeng/drawer';
import { FluidModule } from 'primeng/fluid';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { LayoutService } from '../../../../layout/service/layout.service';

@Component({
    selector: 'app-modal-edit-or-add-formation',
    imports: [ButtonModule, CommonModule, ReactiveFormsModule, MessageModule, DrawerModule, FluidModule, DatePickerModule, InputTextModule],
    templateUrl: './modal-edit-or-add-formation.component.html',
    styleUrl: './modal-edit-or-add-formation.component.scss'
})
export class ModalEditOrAddFormationComponent implements OnInit {
    visibleRight = model<boolean>(false);
    onClose = output<boolean>();
    formationToEdit = input<FormationResponseDTO>({} as FormationResponseDTO);
    formationService = inject(FormationService);
    updateOrAdd = input<'update' | 'add'>('update');
    actionEmitter = output<void>();
    title!: string;

    messageService = inject(MessageService);
    layoutService = inject(LayoutService);

    fb = inject(FormBuilder);
    userForm!: FormGroup;

    ngOnInit(): void {
        if (this.updateOrAdd() == 'update') {
            // pour primeng drop down options
            this.title = 'Editer la formation suivante';

            this.userForm = this.fb.group({
                id: [this.formationToEdit().id],
                title: [this.formationToEdit().title, [Validators.required]],
                company: [this.formationToEdit().company, [Validators.required]],
                city: [this.formationToEdit().city, [Validators.required]],
                country: [this.formationToEdit().country, [Validators.required]],
                startAt: [new Date(this.formationToEdit().startAt), [Validators.required]],
                endAt: [new Date(this.formationToEdit().endAt), [Validators.required]]
            });
        } else if (this.updateOrAdd() == 'add') {
            this.title = 'Ajouter une formation';
            this.userForm = this.fb.group({
                id: [''],
                title: ['', [Validators.required]],
                company: ['', [Validators.required]],
                city: ['', [Validators.required]],
                country: ['France', [Validators.required]],
                startAt: [''],
                endAt: ['']
            });
        }
    }

    close() {
        this.visibleRight.set(false);
        this.onClose.emit(false);
    }

    async submit() {
        if (this.updateOrAdd() == 'update') {
            const newFormation = {
                ...this.userForm.value
            };
            newFormation.id = this.formationToEdit().id;

            await firstValueFrom(this.formationService.updateFormation(newFormation));
        } else if (this.updateOrAdd() == 'add') {
            const newFormation = {
                ...this.userForm.value
            };

            await firstValueFrom(this.formationService.addFormation(newFormation));
        }
        this.visibleRight.set(false);
    }
}
