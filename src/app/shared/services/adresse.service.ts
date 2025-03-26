import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AdresseDTO } from '../models/adresse';
import { HttpClient } from '@angular/common/http';
import { ResponseDTO } from '../models/user';
import { environment } from '../../../environments/environment.development';

@Injectable({
    providedIn: 'root'
})
export class AdresseService {
    private http: HttpClient = inject(HttpClient);
    baseUrl = environment.BACK_URL;

    listAddresses = signal([] as AdresseDTO[]);
    constructor() {}

    getAllAddresses(userId: string): Observable<ResponseDTO> {
        return this.http.get<ResponseDTO>(`${this.baseUrl}/address/all?userId=${userId}`).pipe(tap((res) => this.listAddresses.set(res.data as AdresseDTO[])));
    }
    updateAddresse(adresseDTO: AdresseDTO): Observable<ResponseDTO> {
        return this.http.put<ResponseDTO>(`${this.baseUrl}/address`, adresseDTO).pipe(
            tap((res) => {
                let newAdress = this.listAddresses().findIndex((x) => x.id == adresseDTO.id);
                this.listAddresses()[newAdress] = adresseDTO;

                this.listAddresses.update((oldList) => [...oldList]);
            })
        );
    }
    addAddresse(adresseDTO: AdresseDTO): Observable<ResponseDTO> {
        return this.http.post<ResponseDTO>(`${this.baseUrl}/address`, adresseDTO).pipe(
            tap((res) => {
                const resu = this.listAddresses();
                this.listAddresses.update((oldList) => [...oldList, res.data as AdresseDTO]);
            })
        );
    }

    deleteAddresse(adresseId: string): Observable<ResponseDTO> {
        return this.http.delete<ResponseDTO>(`${this.baseUrl}/address?addressId=${adresseId}`).pipe(
            tap((res) => {
                if (res.status == 204) {
                    this.listAddresses.update((oldList) => oldList.filter((x) => x.id != adresseId));
                }
            })
        );
    }
}
