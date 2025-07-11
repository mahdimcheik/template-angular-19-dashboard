import { Component, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
    selector: 'app-modal-confirm-delete-cursus',
    standalone: true,
    imports: [CommonModule, ButtonModule, DialogModule],
    templateUrl: './modal-confirm-delete-cursus.component.html',
    styleUrls: ['./modal-confirm-delete-cursus.component.scss']
})
export class ModalConfirmDeleteCursusComponent {
    visible = model<boolean>(false);
    title = input<string>('Confirmation');
    question = input<string>('Êtes-vous sûr de vouloir supprimer cet élément ?');

    onDeleteConfirmed = output<void>();
    onCancel = output<void>();

    confirmDelete() {
        this.onDeleteConfirmed.emit();
        this.visible.set(false);
    }

    cancel() {
        this.onCancel.emit();
        this.visible.set(false);
    }
}
