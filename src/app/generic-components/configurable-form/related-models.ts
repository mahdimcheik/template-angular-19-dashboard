import { ValidatorFn } from '@angular/forms';

export interface FormField<T> {
    id: string;
    label: string;
    name: string;
    type: 'text' | 'number' | 'email' | 'password' | 'date' | 'checkbox' | 'radio' | 'select' | 'textarea';
    placeholder?: string;
    value?: T;
    disabled?: boolean;
    readonly?: boolean;
    options?: T[];
    required?: boolean;
    validation?: ValidatorFn[];
}

export interface FormFieldGroup {
    id: string;
    name: string;
    fields: FormField<any>[];
    description?: string;
    icon?: string;
    styleClass?: string;
    sectionId?: string;
}

export const errorMessages: { [key: string]: (errValue: any) => string } = {
    required: () => 'Ce champ est obligatoire.',
    email: () => 'Veuillez saisir une adresse e-mail valide.',
    minlength: (err) => `Ce champ doit contenir au moins ${err.requiredLength} caractères.`,
    maxlength: (err) => `Ce champ ne doit pas dépasser ${err.requiredLength} caractères.`,
    min: (err) => `La valeur minimale autorisée est ${err.min}.`,
    max: (err) => `La valeur maximale autorisée est ${err.max}.`,
    pattern: () => 'Le format de la saisie est incorrect.'
};
