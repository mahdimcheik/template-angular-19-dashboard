import { Component, inject, input, output, OnInit, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { errorMessages, FormField, FormFieldGroup, Structure } from './related-models';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { ColorPickerModule } from 'primeng/colorpicker';
@Component({
    selector: 'app-configurable-form',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, InputTextModule, InputNumberModule, TextareaModule, SelectModule, MultiSelectModule, CheckboxModule, RadioButtonModule, DatePickerModule, ColorPickerModule, ButtonModule],
    templateUrl: './configurable-form.component.html'
})
export class ConfigurableFormComponent implements OnInit {
    private fb = inject(FormBuilder);

    // Input signal for the structure
    structure = input<Structure | null>(null);

    // Output signal for form submission
    onFormSubmit = output<FormGroup>();

    // Form instance - now contains nested FormGroups
    form = signal<FormGroup>(this.fb.group({}));

    // Error messages map
    errorMessages = errorMessages;

    // Computed signal to track form validity
    isFormValid = computed(() => this.form().valid);

    // Computed signal to track if form has been touched
    isFormTouched = computed(() => this.form().touched);

    ngOnInit(): void {
        this.createForm();
    }

    private createForm() {
        const structure = this.structure();
        if (!structure) {
            this.form.set(this.fb.group({}));
            return;
        }

        const formGroups: { [key: string]: FormGroup } = {};

        // Create a FormGroup for each FormFieldGroup
        structure.formFieldGroups.forEach((group: FormFieldGroup) => {
            const groupControls: { [key: string]: FormControl } = {};

            // Add all fields from this group to the group's FormGroup
            group.fields.forEach((field: FormField<any>) => {
                const control = this.fb.control(
                    {
                        value: field.value || this.getDefaultValue(field.type),
                        disabled: field.disabled || false
                    },
                    field.validation || []
                );
                groupControls[field.name] = control;
            });

            // Create FormGroup for this section with group-level validators
            formGroups[group.id] = this.fb.group(groupControls, {
                validators: group.groupValidators || []
            });
        });

        // Create the main form with nested FormGroups
        this.form.set(this.fb.group(formGroups));
        console.log('form', this.form().value);
    }

    private getDefaultValue(type: string): any {
        switch (type) {
            case 'checkbox':
                return false;
            case 'number':
                return 0;
            case 'date':
                return '';
            default:
                return '';
        }
    }

    onSubmit() {
        const formInstance = this.form();
        if (formInstance.valid) {
            this.onFormSubmit.emit(formInstance);
        } else {
            formInstance.markAllAsTouched();
            this.form.set(formInstance); // Trigger change detection
        }
    }

    // Get FormGroup for a specific section
    getFormGroup(groupId: string): FormGroup {
        return this.form().get(groupId) as FormGroup;
    }

    // Get field error from nested FormGroup
    getFieldError(groupId: string, fieldName: string): string | null {
        const groupForm = this.getFormGroup(groupId);
        if (!groupForm) return null;

        const control = groupForm.get(fieldName);
        if (control && control.invalid && (control.dirty || control.touched)) {
            const errors = control.errors;
            if (errors) {
                const fieldLabel = this.structure()
                    ?.formFieldGroups.find((group) => group.id === groupId)
                    ?.fields.find((field) => field.name === fieldName)?.label;
                const errorKey = Object.keys(errors)[0];
                return this.errorMessages[errorKey] ? `${fieldLabel} : ${this.errorMessages[errorKey](errors[errorKey])}` : 'Erreur de validation';
            }
        }
        return null;
    }

    // Get group-level validation errors
    getGroupValidationErrors(groupId: string): string[] {
        const groupForm = this.getFormGroup(groupId);
        if (!groupForm || !groupForm.errors) return [];

        const errors: string[] = [];
        Object.keys(groupForm.errors).forEach((errorKey) => {
            const errorMessage = this.errorMessages[errorKey] ? this.errorMessages[errorKey](groupForm.errors![errorKey]) : `Erreur de validation du groupe: ${errorKey}`;
            errors.push(errorMessage);
        });

        return errors;
    }

    // Check if group has validation errors (not field errors)
    hasGroupValidationErrors(groupId: string): boolean {
        const groupForm = this.getFormGroup(groupId);
        return !!(groupForm && groupForm.errors && Object.keys(groupForm.errors).length > 0);
    }

    // Check if field is invalid in nested FormGroup
    isFieldInvalid(groupId: string, fieldName: string): boolean {
        const groupForm = this.getFormGroup(groupId);
        if (!groupForm) return false;

        const control = groupForm.get(fieldName);
        return !!(control && control.invalid && (control.dirty || control.touched));
    }

    // Check if entire FormGroup (section) is valid
    isGroupValid(groupId: string): boolean {
        const groupForm = this.getFormGroup(groupId);
        return groupForm ? groupForm.valid : false;
    }

    // Check if FormGroup (section) has been touched
    isGroupTouched(groupId: string): boolean {
        const groupForm = this.getFormGroup(groupId);
        return groupForm ? groupForm.touched : false;
    }

    // Get all errors for a FormGroup (section) - includes both field and group errors
    getGroupErrors(groupId: string): string[] {
        const groupForm = this.getFormGroup(groupId);
        if (!groupForm) return [];

        const errors: string[] = [];

        // Add group-level validation errors
        const groupValidationErrors = this.getGroupValidationErrors(groupId);
        errors.push(...groupValidationErrors);

        // Add field-level validation errors
        Object.keys(groupForm.controls).forEach((fieldName) => {
            const fieldError = this.getFieldError(groupId, fieldName);
            if (fieldError) {
                errors.push(fieldError);
            }
        });

        return errors;
    }

    // Get form values in structured format
    getStructuredFormValue(): any {
        const formValue = this.form().value;
        return formValue;
    }

    // Get flattened form values (original single-level structure)
    getFlattenedFormValue(): any {
        const formValue = this.form().value;
        const flattened: any = {};

        Object.keys(formValue).forEach((groupId) => {
            const groupValue = formValue[groupId];
            Object.keys(groupValue).forEach((fieldName) => {
                flattened[fieldName] = groupValue[fieldName];
            });
        });

        return flattened;
    }

    getSelectOptions(field: FormField<any>): any[] {
        return field.options || [];
    }

    // Track function for @for loops
    trackByFieldId(index: number, field: FormField<any>): string {
        return field.id;
    }

    trackByGroupId(index: number, group: FormFieldGroup): string {
        return group.id;
    }

    onCancel() {
        console.log('onCancel');
        console.log('form', this.form().value);
        this.form.set(this.form().hasError('required') ? this.fb.group({}) : this.form());
    }
}
