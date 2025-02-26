import { Component, inject, input, model, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ageValidator, passwordStrengthValidator, passwordValidator } from '../../../../shared/validators/confirmPasswordValidator';
import { AddressDropDown, AdresseDTO } from '../../../../shared/models/adresse';

@Component({
    selector: 'app-modal-add-or-edit-address',
    standalone: false,

    templateUrl: './modal-add-or-edit-address.component.html',
    styleUrl: './modal-add-or-edit-address.component.scss'
})
export class ModalAddOrEditAddressComponent implements OnInit {
    visibleRight = input<boolean>(false);
    onClose = output<boolean>();
    adresseTochange = input.required<AdresseDTO>();
    visible = input<boolean>(false);
    updateOrAdd: 'update' | 'add' = 'update';
    actionEmitter = output<void>();
    selectedType!: AddressDropDown;
    title!: string;

    messageService = inject(MessageService);
    fb = inject(FormBuilder);
    userForm!: FormGroup;

    ngOnInit(): void {
        this.userForm = this.fb.group({
            street: [this.adresseTochange().street, [Validators.required]],
            streetNumber: [this.adresseTochange().streetNumber, [Validators.required]],
            streetLine2: [this.adresseTochange().streetLine2],
            postalCode: [this.adresseTochange().postalCode, [Validators.required]],
            city: [this.adresseTochange().city, [Validators.required]],
            addressType: [this.selectedType],
            country: [this.adresseTochange().country],
            state: [this.adresseTochange().state]
        });
    }

    close() {
        this.onClose.emit(false);
    }

    submit() {}
}
