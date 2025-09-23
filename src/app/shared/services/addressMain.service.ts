import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
// import { AdresseDTO } from '../models/adresse';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AddressCreateDTO } from '../../api/models/AddressCreateDTO';
import { AddressUpdateDTO } from '../../api/models/AddressUpdateDTO';
import { Address } from '../../api/models/Address';
import { AddressService } from '../../api/services/AddressService';
import { AddressResponseDTOListResponseDTO } from '../../api/models/AddressResponseDTOListResponseDTO';
import { AddressResponseDTOResponseDTO } from '../../api/models/AddressResponseDTOResponseDTO';
import { StringResponseDTO } from '../../api/models/StringResponseDTO';
import { AddressDropDown } from '../models/adresseOption';
import { AddressTypeEnum } from '../../api/models/AddressTypeEnum';
/**
 * Service pour gérer les adresses des utilisateurs.
 * Fournit des méthodes pour récupérer, ajouter, mettre à jour et supprimer des adresses via l'API.
 * Utilise AddressService généré par OpenAPI pour les appels API.
 * Stocke les adresses dans un signal pour une réactivité facile dans les composants Angular.
 */
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
/**
 * Récupère toutes les adresses d'un utilisateur.
 * @param userId L'ID de l'utilisateur
 * @param forOwner Indique si la requête est pour le propriétaire
 * @returns Un observable contenant la liste des adresses
 */
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

    /**
     * Met à jour une adresse existante.
     * @param adresseDTO Les données de l'adresse à mettre à jour
     * @param forOwner Indique si la requête est pour le propriétaire
     * @returns Un observable contenant la réponse de l'API
     */
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

    /**
     * Ajoute une nouvelle adresse.
     * @param adresseDTO Les données de l'adresse à ajouter
     * @param forOwner Indique si la requête est pour le propriétaire
     * @returns Un observable contenant la réponse de l'API
     */
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

    /**
     * Supprime une adresse existante.
     * @param adresseId L'ID de l'adresse à supprimer
     * @param forOwner Indique si la requête est pour le propriétaire
     * @returns Un observable contenant la réponse de l'API
     */
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
