import { Pipe, PipeTransform } from '@angular/core';
import { Level } from '../../api/models/Level';

@Pipe({
    name: 'cursusLevel'
})
export class CursusLevelPipe implements PipeTransform {
    transform(level: string): string {
        switch (level) {
            case 'beginner':
                return 'Débutant';
            case 'intermediate':
                return 'Intermédiaire';
            case 'advanced':
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
            case 'beginner':
                return 'p-badge-success';
            case 'intermediate':
                return 'p-badge-warning';
            case 'advanced':
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
            case 'beginner':
                return 'pi pi-star';
            case 'intermediate':
                return 'pi pi-star-fill';
            case 'advanced':
                return 'pi pi-crown';
            default:
                return 'pi pi-question';
        }
    }
}
