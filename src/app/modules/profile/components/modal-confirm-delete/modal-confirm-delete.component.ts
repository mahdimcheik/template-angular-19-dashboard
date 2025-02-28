import { Component, input, model, output } from '@angular/core';

@Component({
    selector: 'app-modal-confirm-delete',
    standalone: false,

    templateUrl: './modal-confirm-delete.component.html',
    styleUrl: './modal-confirm-delete.component.scss'
})
export class ModalConfirmDeleteComponent {
    visible = model<boolean>(false);
    question = input<string>('Vous êtes sûr de vouloir supprimer cet élément ?');
    header = input<string>('Suppression');
    title = input.required<string>();
    onDeleteConfirmed = output<void>();

    close() {
        this.visible.set(false);
    }
    confirm() {
        this.onDeleteConfirmed.emit();
        this.visible.set(false);
    }
}
