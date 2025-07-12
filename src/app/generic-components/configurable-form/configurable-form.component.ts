import { Component, input, computed, signal, effect, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DatePickerModule } from 'primeng/datepicker';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ButtonModule } from 'primeng/button';
import { Structure, FormField, FormFieldGroup, errorMessages } from './related-models';

@Component({
    selector: 'app-configurable-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, InputTextModule, InputNumberModule, TextareaModule, SelectModule, MultiSelectModule, CheckboxModule, RadioButtonModule, DatePickerModule, ColorPickerModule, ButtonModule],
    templateUrl: './configurable-form.component.html'
})
export class ConfigurableFormComponent {
    structure = input<Structure>();
    onFormSubmit = output<any>();
    form = signal<FormGroup>(new FormGroup({}));

    constructor(private fb: FormBuilder) {
        effect(() => {
            const structureData = this.structure();
            if (structureData) {
                this.form.set(this.createForm(structureData));
            }
        });
    }

    private createForm(structure: Structure): FormGroup {
        const formGroups: { [key: string]: FormGroup } = {};

        structure.formFieldGroups.forEach((group) => {
            const groupControls: { [key: string]: any } = {};

            group.fields.forEach((field) => {
                const validators = [];

                if (field.required) {
                    validators.push(Validators.required);
                }

                if (field.validation) {
                    validators.push(...field.validation);
                }

                groupControls[field.name] = [{ value: field.value || '', disabled: field.disabled || false }, validators];
            });

            // Create the group with field controls
            const formGroup = this.fb.group(groupControls);

            // Add group-level validators if they exist
            if (group.groupValidators && group.groupValidators.length > 0) {
                formGroup.setValidators(group.groupValidators);
            }

            formGroups[group.id] = formGroup;
        });

        return this.fb.group(formGroups);
    }

    getFormGroup(groupId: string): FormGroup {
        return this.form().get(groupId) as FormGroup;
    }

    isGroupValid(groupId: string): boolean {
        return this.getFormGroup(groupId)?.valid || false;
    }

    isGroupTouched(groupId: string): boolean {
        return this.getFormGroup(groupId)?.touched || false;
    }

    isFieldInvalid(groupId: string, fieldName: string): boolean {
        const field = this.getFormGroup(groupId)?.get(fieldName);
        return field ? field.invalid && field.touched : false;
    }

    getFieldError(groupId: string, fieldName: string): string | null {
        const field = this.getFormGroup(groupId)?.get(fieldName);
        if (field && field.errors && field.touched) {
            const firstError = Object.keys(field.errors)[0];
            const errorValue = field.errors[firstError];
            return errorMessages[firstError] ? errorMessages[firstError](errorValue) : `Erreur de validation: ${firstError}`;
        }
        return null;
    }

    getGroupErrors(groupId: string): string[] {
        const group = this.getFormGroup(groupId);
        if (!group) return [];

        const errors: string[] = [];

        // Add group-level validation errors
        if (group.errors) {
            Object.keys(group.errors).forEach((errorKey) => {
                const errorValue = group.errors![errorKey];
                if (errorMessages[errorKey]) {
                    errors.push(errorMessages[errorKey](errorValue));
                } else {
                    errors.push(`Erreur de validation du groupe: ${errorKey}`);
                }
            });
        }

        // Add field-level validation errors
        Object.keys(group.controls).forEach((fieldName) => {
            const field = group.get(fieldName);
            if (field && field.errors && field.touched) {
                Object.keys(field.errors).forEach((errorKey) => {
                    const errorValue = field.errors![errorKey];
                    if (errorMessages[errorKey]) {
                        errors.push(errorMessages[errorKey](errorValue));
                    } else {
                        errors.push(`Erreur de validation: ${errorKey}`);
                    }
                });
            }
        });

        return errors;
    }

    getGroupValidationErrors(groupId: string): string[] {
        const group = this.getFormGroup(groupId);
        if (!group || !group.errors) return [];

        const errors: string[] = [];
        Object.keys(group.errors).forEach((errorKey) => {
            const errorValue = group.errors![errorKey];
            if (errorMessages[errorKey]) {
                errors.push(errorMessages[errorKey](errorValue));
            } else {
                errors.push(`Erreur de validation du groupe: ${errorKey}`);
            }
        });

        return errors;
    }

    hasGroupValidationErrors(groupId: string): boolean {
        const group = this.getFormGroup(groupId);
        return group ? !!group.errors : false;
    }

    isFormValid(): boolean {
        return this.form().valid;
    }

    getSelectOptions(field: FormField<any>): any[] {
        if (!field.options) return [];

        // If options are already objects with label/value structure, return as-is
        if (field.options.length > 0 && typeof field.options[0] === 'object' && field.options[0].label) {
            return field.options;
        }

        // Convert simple array to label/value format for PrimeNG
        return field.options.map((option) => ({
            label: option.toString(),
            value: option
        }));
    }

    trackByGroupId(index: number, group: FormFieldGroup): string {
        return group.id;
    }

    trackByFieldId(index: number, field: FormField<any>): string {
        return field.id;
    }

    onSubmit(): void {
        if (this.form().valid) {
            console.log('Form submitted with values:', this.form().value);
            console.log('Flattened form values:', this.getFlattenedFormValues());
            this.onFormSubmit.emit(this.getFlattenedFormValues());
        } else {
            console.log('Form is invalid');
            this.form().markAllAsTouched();
        }
    }

    getFlattenedFormValues(): any {
        const result: any = {};
        const formValue = this.form().value;

        Object.keys(formValue).forEach((groupId) => {
            const groupValue = formValue[groupId];
            Object.keys(groupValue).forEach((fieldName) => {
                result[fieldName] = groupValue[fieldName];
            });
        });

        return result;
    }
}
