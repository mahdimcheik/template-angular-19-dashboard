import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
// import { AdresseDTO } from '../models/adresse';
import { HttpClient } from '@angular/common/http';
import { ResponseDTO } from '../models/user';
import { environment } from '../../../environments/environment.development';
import { AddressCreateDTO } from '../../api/models/AddressCreateDTO';
import { AddressUpdateDTO } from '../../api/models/AddressUpdateDTO';
import { Address } from '../../api/models/Address';

@Injectable({
    providedIn: 'root'
})
export class AdresseService {
    private http: HttpClient = inject(HttpClient);
    baseUrl = environment.BACK_URL;

    addresses = signal<Address[]>([]);
    constructor() {}

    getAllAddresses(userId: string, forOwner: boolean = true): Observable<ResponseDTO> {
        return this.http.get<ResponseDTO>(`${this.baseUrl}/address/all?userId=${userId}`).pipe(
            tap((res) => {
                if (!forOwner) {
                    return;
                }
                this.addresses.set(res.data as Address[]);
            })
        );
    }
    updateAddresse(adresseDTO: AddressUpdateDTO, forOwner: boolean = true): Observable<ResponseDTO> {
        return this.http.put<ResponseDTO>(`${this.baseUrl}/address`, adresseDTO).pipe(
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
    addAddresse(adresseDTO: AddressCreateDTO, forOwner: boolean = true): Observable<ResponseDTO> {
        return this.http.post<ResponseDTO>(`${this.baseUrl}/address`, adresseDTO).pipe(
            tap((res) => {
                if (!forOwner) {
                    return;
                }
                const resu = this.addresses();
                this.addresses.update((oldList) => [...oldList, res.data as Address]);
            })
        );
    }

    deleteAddresse(adresseId: string, forOwner: boolean = true): Observable<ResponseDTO> {
        return this.http.delete<ResponseDTO>(`${this.baseUrl}/address?addressId=${adresseId}`).pipe(
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
