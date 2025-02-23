import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AdresseDTO } from '../models/adresse';
import { HttpClient } from '@angular/common/http';
import { LocalstorageService } from './localstorage.service';
import { MessageService } from 'primeng/api';
import { ResponseDTO } from '../models/user';

@Injectable({
    providedIn: 'root'
})
export class AdresseService {
    private http: HttpClient = inject(HttpClient);
    private localStorageService = inject(LocalstorageService);
    private messageService = inject(MessageService);

    listAddresses = signal([] as AdresseDTO[]);
    constructor() {}

    getAllAddresses(userId: string): Observable<ResponseDTO> {
        return this.http.get<ResponseDTO>(`https://localhost:7113/address/all?userId=${userId}`).pipe(tap((res) => this.listAddresses.set(res.data as AdresseDTO[])));
    }
    updateAddresse(adresseDTO: AdresseDTO): Observable<ResponseDTO> {
        return this.http.put<ResponseDTO>(`https://localhost:7113/address`, adresseDTO).pipe(
            tap((res) => {
                let newAdress = this.listAddresses().findIndex((x) => x.id == adresseDTO.id);
                this.listAddresses()[newAdress] = adresseDTO;

                this.listAddresses.update((oldList) => [...oldList]);
            })
        );
    }
    addAddresse(adresseDTO: AdresseDTO): Observable<ResponseDTO> {
        return this.http.post<ResponseDTO>(`https://localhost:7113/address`, adresseDTO).pipe(
            tap((res) => {
                const resu = this.listAddresses();
                this.listAddresses.update((oldList) => [...oldList, res.data as AdresseDTO]);
            })
        );
    }

    deleteAddresse(adresseId: string): Observable<ResponseDTO> {
        return this.http.delete<ResponseDTO>(`https://localhost:7113/address?addressId=${adresseId}`).pipe(
            tap((res) => {
                if (res.status == 204) {
                    this.listAddresses.update((oldList) => oldList.filter((x) => x.id != adresseId));
                }
            })
        );
    }
}
