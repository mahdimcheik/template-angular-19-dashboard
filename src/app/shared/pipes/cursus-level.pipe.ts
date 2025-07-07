import { Pipe, PipeTransform } from '@angular/core';
import { CursusLevel } from '../models/cursus';

@Pipe({
    name: 'cursusLevel'
})
export class CursusLevelPipe implements PipeTransform {
    transform(level: string): string {
        switch (level) {
            case CursusLevel.Beginner:
                return 'Débutant';
            case CursusLevel.Intermediate:
                return 'Intermédiaire';
            case CursusLevel.Advanced:
                return 'Avancé';
            default:
                return 'Non défini';
        }
    }
}

@Pipe({
    name: 'cursusLevelBadge'
})
export class CursusLevelBadgePipe implements PipeTransform {
    transform(level: string): string {
        switch (level) {
            case CursusLevel.Beginner:
                return 'p-badge-success';
            case CursusLevel.Intermediate:
                return 'p-badge-warning';
            case CursusLevel.Advanced:
                return 'p-badge-danger';
            default:
                return 'p-badge-secondary';
        }
    }
}

@Pipe({
    name: 'cursusLevelIcon'
})
export class CursusLevelIconPipe implements PipeTransform {
    transform(level: string): string {
        switch (level) {
            case CursusLevel.Beginner:
                return 'pi pi-star';
            case CursusLevel.Intermediate:
                return 'pi pi-star-fill';
            case CursusLevel.Advanced:
                return 'pi pi-crown';
            default:
                return 'pi pi-question';
        }
    }
}
