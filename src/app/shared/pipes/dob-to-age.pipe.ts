import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dobToAge'
})
export class DobToAgePipe implements PipeTransform {
    transform(dob: Date | string): number {
        if (!dob) return 0;

        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();

        // Check if birthday has occurred this year
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    }
}
