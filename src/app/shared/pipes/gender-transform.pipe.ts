import { Pipe, PipeTransform } from '@angular/core';
import { EnumGender } from '../models/user';

@Pipe({
    name: 'genderTransform'
})
export class GenderTransformPipe implements PipeTransform {
    transform(genderNumber: number): string {
        switch (genderNumber) {
            case EnumGender.Homme:
                return 'Homme';
            case EnumGender.Femme:
                return 'Femme';
            case EnumGender.NonBinaire:
                return 'NonBinaire';
            case EnumGender.Autre:
                return 'Autre';
            default:
                return 'Unknown';
        }
    }
}
