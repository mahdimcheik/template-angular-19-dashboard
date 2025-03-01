import { Pipe, PipeTransform } from '@angular/core';
import { AddressTypeEnum } from '../models/adresse';

@Pipe({
    name: 'adresseType'
})
export class AdresseTypePipe implements PipeTransform {
    transform(adresseTypeNumber: number): string {
        switch (adresseTypeNumber) {
            case AddressTypeEnum.Domicile:
                return 'Domicile';
            case AddressTypeEnum.Travail:
                return 'Travail';
            case AddressTypeEnum.Facturation:
                return 'Facturation';
            case AddressTypeEnum.Livraison:
                return 'Livraison';
            default:
                return 'Non défini';
        }
    }
}

@Pipe({
    name: 'adresseImage'
})
export class AdresseImagePipe implements PipeTransform {
    transform(adresseTypeNumber: number): string {
        switch (adresseTypeNumber) {
            case AddressTypeEnum.Domicile:
                return 'assets/home.svg';
            case AddressTypeEnum.Travail:
                return 'assets/work.svg';
            case AddressTypeEnum.Facturation:
                return 'assets/bill.svg';
            case AddressTypeEnum.Livraison:
                return 'assets/delivery.svg';
            default:
                return 'Non défini';
        }
    }
}
