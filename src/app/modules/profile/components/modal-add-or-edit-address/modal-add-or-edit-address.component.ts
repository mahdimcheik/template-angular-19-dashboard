import { Component, inject, input, model, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ageValidator, passwordStrengthValidator, passwordValidator } from '../../../../shared/validators/confirmPasswordValidator';
import { AddressDropDown, AddressTypeEnum, AdresseDTO } from '../../../../shared/models/adresse';
import { firstValueFrom } from 'rxjs';
import { AdresseService } from '../../../../shared/services/adresse.service';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FluidModule } from 'primeng/fluid';
import { DrawerModule } from 'primeng/drawer';

@Component({
    selector: 'app-modal-add-or-edit-address',
    imports: [CommonModule, FormsModule, FluidModule, DrawerModule, DialogModule, SelectModule, ButtonModule, SelectButtonModule, MessageModule, ReactiveFormsModule, DatePickerModule, InputTextModule, InputIconModule],
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
    adresseService = inject(AdresseService);
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
                streetNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(5)]],
                streetLine2: ['', [Validators.required, Validators.maxLength(40)]],
                postalCode: ['', [Validators.required, Validators.maxLength(5)]],
                city: ['', [Validators.required, Validators.maxLength(25)]],
                addressType: [this.selectedType],
                country: ['France', [Validators.required, Validators.maxLength(25)]],
                state: ['']
            });
        }
    }

    close() {
        this.visibleRight.set(false);
        this.onClose.emit(false);
    }

    async submit() {
        this.visibleRight.set(false);
        if (this.updateOrAdd() == 'update') {
            const newAdresse = {
                ...this.userForm.value,
                addressType: this.userForm.value['addressType'].value,
                id: this.adresseTochange().id
            };

            this.actionEmitter.emit();
            await firstValueFrom(this.adresseService.updateAddresse(newAdresse));
        } else if (this.updateOrAdd() == 'add') {
            const newAdresse = {
                ...this.userForm.value,
                addressType: this.userForm.value['addressType'].value
            };

            this.actionEmitter.emit();
            await firstValueFrom(this.adresseService.addAddresse(newAdresse));
        }
    }
}
