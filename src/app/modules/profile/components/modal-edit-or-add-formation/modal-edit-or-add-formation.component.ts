import { Component, inject, input, model, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { FormationResponseDTO } from '../../../../shared/models/formation';

@Component({
    selector: 'app-modal-edit-or-add-formation',
    standalone: false,

    templateUrl: './modal-edit-or-add-formation.component.html',
    styleUrl: './modal-edit-or-add-formation.component.scss'
})
export class ModalEditOrAddFormationComponent implements OnInit {
    visibleRight = model<boolean>(false);
    onClose = output<boolean>();
    formationToEdit = input<FormationResponseDTO>({} as FormationResponseDTO);
    updateOrAdd = input<'update' | 'add'>('update');
    actionEmitter = output<void>();
    title!: string;

    messageService = inject(MessageService);
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
                startAt: [new Date(this.formationToEdit().startAt)],
                endAt: [new Date(this.formationToEdit().endAt)]
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
        this.onClose.emit(false);
    }

    submit() {
        console.log(this.userForm.value);
    }
}
