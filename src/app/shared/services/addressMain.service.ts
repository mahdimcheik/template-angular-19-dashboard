import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
// import { AdresseDTO } from '../models/adresse';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { AddressCreateDTO } from '../../api/models/AddressCreateDTO';
import { AddressUpdateDTO } from '../../api/models/AddressUpdateDTO';
import { Address } from '../../api/models/Address';
import { AddressService } from '../../api/services/AddressService';
import { AddressResponseDTOListResponseDTO } from '../../api/models/AddressResponseDTOListResponseDTO';
import { AddressResponseDTOResponseDTO } from '../../api/models/AddressResponseDTOResponseDTO';
import { StringResponseDTO } from '../../api/models/StringResponseDTO';
import { AddressDropDown } from '../models/adresseOption';
import { AddressTypeEnum } from '../../api/models/AddressTypeEnum';

@Injectable({
    providedIn: 'root'
})
export class AddressMainService {
    private http: HttpClient = inject(HttpClient);
    private addressService = inject(AddressService);
    baseUrl = environment.BACK_URL;

    addresses = signal<Address[]>([]);
    typesAdresseList: AddressDropDown[] = [
        {
            id: '1',
            name: 'Domicile',
            value: AddressTypeEnum._1
        },
        {
            id: '2',
            name: 'Travail',
            value: AddressTypeEnum._2
        },
        {
            id: '3',
            name: 'Facturation',
            value: AddressTypeEnum._3
        },
        {
            id: '4',
            name: 'Livraison',
            value: AddressTypeEnum._4
        }
    ];
    constructor() {}

    getAllAddresses(userId: string, forOwner: boolean = true): Observable<AddressResponseDTOListResponseDTO> {
        return this.addressService.getAddressAll(userId).pipe(
            tap((res) => {
                if (!forOwner) {
                    return;
                }
                this.addresses.set(res.data as Address[]);
            })
        );
    }

    updateAddresse(adresseDTO: AddressUpdateDTO, forOwner: boolean = true): Observable<AddressResponseDTOResponseDTO> {
        return this.addressService.putAddress(adresseDTO).pipe(
            tap((res) => {
                if (!forOwner) {
                    return;
                }
                let newAdress = this.addresses().findIndex((x) => x.id == adresseDTO.id);
                this.addresses()[newAdress] = adresseDTO as Address;

                this.addresses.update((oldList) => [...oldList]);
            })
        );
    }

    addAddresse(adresseDTO: AddressCreateDTO, forOwner: boolean = true): Observable<AddressResponseDTOResponseDTO> {
        return this.addressService.postAddress(adresseDTO).pipe(
            tap((res) => {
                if (!forOwner) {
                    return;
                }
                const resu = this.addresses();
                this.addresses.update((oldList) => [...oldList, res.data as Address]);
            })
        );
    }

    deleteAddresse(adresseId: string, forOwner: boolean = true): Observable<StringResponseDTO> {
        return this.addressService.deleteAddress(adresseId).pipe(
            tap((res) => {
                if (!forOwner) {
                    return;
                }
                if (res.status == 204) {
                    this.addresses.update((oldList) => oldList.filter((x) => x.id != adresseId));
                }
            })
        );
    }
}
