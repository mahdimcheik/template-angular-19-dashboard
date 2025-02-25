import { Pipe, PipeTransform } from '@angular/core';
import { EnumTypeHelp } from '../../shared/Models/slot';

@Pipe({
  name: 'helpType',
})
export class HelpTypePipe implements PipeTransform {
  transform(typeHelp: number): string {
    switch (typeHelp) {
      case EnumTypeHelp.other:
        return 'Autre';
      case EnumTypeHelp.homework:
        return 'Aides aux devoirs';
      case EnumTypeHelp.exams:
        return 'Péparation aux examens';
      default:
        return 'Non défini';
    }
  }
}
