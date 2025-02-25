import { Pipe, PipeTransform } from '@angular/core';
import { AddressTypeEnum } from '../../shared/Models/adresse';

@Pipe({
  name: 'adresseType',
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
