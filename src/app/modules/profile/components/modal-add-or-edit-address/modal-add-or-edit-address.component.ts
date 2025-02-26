import { Component, inject, input, model, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ageValidator, passwordStrengthValidator, passwordValidator } from '../../../../shared/validators/confirmPasswordValidator';
import { AddressDropDown, AddressTypeEnum, AdresseDTO } from '../../../../shared/models/adresse';

@Component({
    selector: 'app-modal-add-or-edit-address',
    standalone: false,

    templateUrl: './modal-add-or-edit-address.component.html',
    styleUrl: './modal-add-or-edit-address.component.scss'
})
export class ModalAddOrEditAddressComponent implements OnInit {
    visibleRight = model<boolean>(false);
    onClose = output<boolean>();
    adresseTochange = input<AdresseDTO>({} as AdresseDTO);
    updateOrAdd = input<'update' | 'add'>('update');
    actionEmitter = output<void>();
    selectedType!: AddressDropDown;
    title!: string;

    messageService = inject(MessageService);
    fb = inject(FormBuilder);
    userForm!: FormGroup;

    typesAdresseList: AddressDropDown[] = [
        {
            id: '1',
            name: 'Domicile',
            value: AddressTypeEnum.Domicile
        },
        {
            id: '2',
            name: 'Travail',
            value: AddressTypeEnum.Travail
        },
        {
            id: '3',
            name: 'Facturation',
            value: AddressTypeEnum.Facturation
        },
        {
            id: '4',
            name: 'Livraison',
            value: AddressTypeEnum.Livraison
        }
    ];

    ngOnInit(): void {
        if (this.updateOrAdd() == 'update') {
            this.title = "Editer l'adresse suivante";
            this.selectedType = this.typesAdresseList.find((x) => x.id == '' + this.adresseTochange().addressType) ?? {
                id: '1',
                name: 'Domicile',
                value: AddressTypeEnum.Domicile
            };

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
        } else {
            this.title = 'Ajouter une nouvelle adresse';
            this.selectedType = this.typesAdresseList[0];

            this.userForm = this.fb.group({
                street: ['', [Validators.required]],
                streetNumber: ['', [Validators.required]],
                streetLine2: [''],
                postalCode: ['', [Validators.required]],
                city: ['', [Validators.required]],
                addressType: [this.selectedType],
                country: ['France'],
                state: ['']
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
