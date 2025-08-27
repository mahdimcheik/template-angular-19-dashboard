import { Component, computed, inject, input, model, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AddressDropDown } from '../../../../shared/models/adresseOption';
import { firstValueFrom } from 'rxjs';
import { AddressMainService } from '../../../../shared/services/addressMain.service';
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
import { LayoutService } from '../../../../layout/service/layout.service';
import { Address } from '../../../../api/models/Address';
import { AddressTypeEnum } from '../../../../api/models/AddressTypeEnum';
import { Structure } from '../../../../generic-components/configurable-form/related-models';
import { ConfigurableFormComponent } from '../../../../generic-components/configurable-form/configurable-form.component';

@Component({
    selector: 'app-modal-add-or-edit-address',
    imports: [CommonModule, ConfigurableFormComponent, FormsModule, FluidModule, DrawerModule, DialogModule, SelectModule, ButtonModule, SelectButtonModule, MessageModule, ReactiveFormsModule, DatePickerModule, InputTextModule, InputIconModule],
    templateUrl: './modal-add-or-edit-address.component.html',
    styleUrl: './modal-add-or-edit-address.component.scss'
})
export class ModalAddOrEditAddressComponent implements OnInit {
    messageService = inject(MessageService);
    adresseService = inject(AddressMainService);
    layoutService = inject(LayoutService);
    fb = inject(FormBuilder);

    visibleRight = model<boolean>(false);
    onClose = output<boolean>();
    adresseTochange = input<Address>({} as Address);
    updateOrAdd = input<'update' | 'add'>('update');
    actionEmitter = output<void>();
    selectedType!: AddressDropDown;
    title = computed(() => (this.updateOrAdd() == 'update' ? "Editer l'adresse suivante" : 'Ajouter une nouvelle adresse'));
    imgUrl = computed(() => (!this.layoutService.isDarkTheme() ? 'assets/skillHiveSecondaryBlack.svg' : 'assets/skillHiveSecondaryWhite.svg'));

    addressStructure!: Structure;

    typesAdresseList: AddressDropDown[] = this.adresseService.typesAdresseList;

    ngOnInit(): void {
        this.selectedType = this.typesAdresseList.find((x) => x.id == '' + this.adresseTochange()?.addressType) ?? {
            id: '1',
            name: 'Domicile',
            value: AddressTypeEnum._1
        };
        if (this.updateOrAdd() == 'update') {
            this.addressStructure = {
                id: 'address',
                name: 'address',
                label: 'Adresse',
                description: this.title(),
                imgUrl: this.imgUrl(),
                formFieldGroups: [
                    {
                        id: 'address',
                        name: 'address',
                        description: 'Adresse',
                        fields: [
                            {
                                id: 'street',
                                name: 'street',
                                label: 'Rue',
                                type: 'text',
                                placeholder: 'Rue',
                                value: this.adresseTochange().street,
                                required: true,
                                order: 1
                            },
                            {
                                id: 'streetNumber',
                                name: 'streetNumber',
                                label: 'Numéro de rue',
                                type: 'text',
                                placeholder: 'Numéro de rue',
                                value: this.adresseTochange().streetNumber,
                                required: true,
                                order: 2
                            },
                            {
                                id: 'streetLine2',
                                name: 'streetLine2',
                                label: "Complément d'adresse",
                                type: 'text',
                                placeholder: "Complément d'adresse",
                                value: this.adresseTochange().streetLine2,
                                required: false,
                                order: 3
                            },
                            {
                                id: 'postalCode',
                                name: 'postalCode',
                                label: 'Code postal',
                                type: 'text',
                                placeholder: 'Code postal',
                                value: this.adresseTochange().postalCode,
                                required: true,
                                order: 4
                            },
                            {
                                id: 'city',
                                name: 'city',
                                label: 'Ville',
                                type: 'text',
                                placeholder: 'Ville',
                                value: this.adresseTochange().city,
                                required: true,
                                order: 5
                            },
                            {
                                id: 'state',
                                name: 'state',
                                label: 'État',
                                type: 'text',
                                placeholder: 'État',
                                value: this.adresseTochange().state,
                                required: false,
                                order: 6
                            },
                            {
                                id: 'addressType',
                                name: 'addressType',
                                label: "Type d'adresse",
                                type: 'select',
                                placeholder: "Type d'adresse",
                                options: this.typesAdresseList,
                                value: this.selectedType,
                                displayKey: 'name',
                                required: true,
                                order: 7
                            },
                            {
                                id: 'country',
                                name: 'country',
                                label: 'Pays',
                                type: 'text',
                                placeholder: 'Pays',
                                value: this.adresseTochange().country,
                                required: true,
                                order: 8
                            }
                        ]
                    }
                ]
            };
        } else {
            this.selectedType = this.typesAdresseList[0];

            this.addressStructure = {
                id: 'address',
                name: 'address',
                label: 'Adresse',
                description: this.title(),
                imgUrl: this.imgUrl(),
                formFieldGroups: [
                    {
                        id: 'address',
                        name: 'address',
                        label: this.title(),
                        description: 'Adresse',
                        groupValidators: [Validators.required],
                        fields: [
                            {
                                id: 'street',
                                name: 'street',
                                label: 'Rue',
                                type: 'text',
                                placeholder: 'Rue',
                                required: true,
                                order: 1
                            },
                            {
                                id: 'streetNumber',
                                name: 'streetNumber',
                                label: 'Numéro de rue',
                                type: 'text',
                                placeholder: 'Numéro de rue',
                                required: true,
                                order: 2
                            },
                            {
                                id: 'streetLine2',
                                name: 'streetLine2',
                                label: "Complément d'adresse",
                                type: 'text',
                                placeholder: "Complément d'adresse",
                                required: false,
                                order: 3
                            },
                            {
                                id: 'postalCode',
                                name: 'postalCode',
                                label: 'Code postal',
                                type: 'text',
                                placeholder: 'Code postal',
                                required: true,
                                order: 4
                            },
                            {
                                id: 'city',
                                name: 'city',
                                label: 'Ville',
                                type: 'text',
                                placeholder: 'Ville',
                                required: true,
                                order: 5
                            },
                            {
                                id: 'state',
                                name: 'state',
                                label: 'État',
                                type: 'text',
                                placeholder: 'État',
                                required: false,
                                order: 6
                            },
                            {
                                id: 'addressType',
                                name: 'addressType',
                                label: "Type d'adresse",
                                type: 'select',
                                placeholder: "Type d'adresse",
                                options: this.typesAdresseList,
                                value: this.selectedType,
                                displayKey: 'name',
                                required: true,
                                order: 7
                            },
                            {
                                id: 'country',
                                name: 'country',
                                label: 'Pays',
                                type: 'text',
                                placeholder: 'Pays',
                                value: this.adresseTochange().country,
                                required: true,
                                order: 8
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
        const formValue = event.value.address;

        this.visibleRight.set(false);
        if (this.updateOrAdd() == 'update') {
            const newAdresse = {
                ...formValue,
                addressType: +formValue['addressType'].id,
                id: this.adresseTochange().id
            };

            this.actionEmitter.emit();
            await firstValueFrom(this.adresseService.updateAddresse(newAdresse));
        } else if (this.updateOrAdd() == 'add') {
            const newAdresse = {
                ...formValue,
                addressType: +formValue['addressType'].id
            };
            this.actionEmitter.emit();
            await firstValueFrom(this.adresseService.addAddresse(newAdresse));
        }
    }
}
