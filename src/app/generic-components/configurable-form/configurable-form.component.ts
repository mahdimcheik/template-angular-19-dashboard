import { Component, inject, input, output, OnInit, signal, computed, effect, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormControl, FormArray } from '@angular/forms';
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
    styleUrls: ['./configurable-form.component.scss'],
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, InputTextModule, InputNumberModule, TextareaModule, SelectModule, MultiSelectModule, CheckboxModule, RadioButtonModule, DatePickerModule, ColorPickerModule, ButtonModule],
    templateUrl: './configurable-form.component.html',
    changeDetection: ChangeDetectionStrategy.Default
})
export class ConfigurableFormComponent implements OnInit {
    private fb = inject(FormBuilder);

    // Input signal for the structure
    structure = input<Structure | null>(null);

    // Output signal for form submission
    onFormSubmit = output<FormGroup>();
    onCancel = output<void>();

    // Form instance - now contains nested FormGroups
    form = signal<FormGroup>(this.fb.group({}));

    // Reactive signal to track form validity
    formValid = signal<boolean>(true);

    // Reactive signal to track form touched state
    formTouched = signal<boolean>(false);

    // Error messages map
    errorMessages = errorMessages;

    // Computed signal to track form validity (now properly reactive)
    isFormValid = computed(() => {
        return this.formValid();
    });

    // Computed signal to track if form has been touched (now properly reactive)
    isFormTouched = computed(() => this.formTouched());

    // Computed signals for sorted fields and groups
    sortedFormElements = computed(() => {
        const structure = this.structure();
        if (!structure) return [];

        const elements: (FormField<any> | FormFieldGroup)[] = [];

        // Add FormFieldGroups
        structure.formFieldGroups?.forEach((group) => {
            elements.push(group);
        });

        // Add FormFields
        structure.formFields?.forEach((field) => {
            elements.push(field);
        });

        // Sort by order, default to high value if no order specified
        return [...elements].sort((a, b) => {
            const orderA = (a as FormField<any> | FormFieldGroup).order ?? 999999;
            const orderB = (b as FormField<any> | FormFieldGroup).order ?? 999999;
            return orderA - orderB;
        });
    });

    constructor() {
        // Use effect to respond to structure changes
        effect(() => {
            const structureData = this.structure();
            if (structureData) {
                this.createForm();
            }
        });
    }

    ngOnInit(): void {}

    private createForm() {
        const structure = this.structure();
        if (!structure) {
            this.form.set(this.fb.group({}));
            return;
        }

        const formControls: { [key: string]: FormGroup | FormControl } = {};

        // Create FormGroups for each FormFieldGroup
        structure.formFieldGroups?.forEach((group: FormFieldGroup) => {
            const groupControls: { [key: string]: FormControl } = {};

            // Add all fields from this group to the group's FormGroup
            group.fields.forEach((field: FormField<any>) => {
                const validators = this.createFieldValidators(field);
                const control = this.fb.control(
                    {
                        value: field.value || this.getDefaultValue(field.type),
                        disabled: field.disabled || false
                    },
                    validators
                );
                groupControls[field.name] = control;
            });

            // Create FormGroup for this section with group-level validators
            formControls[group.id] = this.fb.group(groupControls, {
                validators: group.groupValidators || []
            });
        });

        // Create FormControls for direct formFields
        structure.formFields?.forEach((field: FormField<any>) => {
            const validators = this.createFieldValidators(field);
            const control = this.fb.control(
                {
                    value: field.value || this.getDefaultValue(field.type),
                    disabled: field.disabled || false
                },
                validators
            );
            formControls[field.name] = control;
        });

        // Create the main form with both FormGroups and direct FormControls
        const newForm = this.fb.group(formControls, {
            validators: structure.globalValidators || []
        });
        this.form.set(newForm);

        // Set up reactivity for form validity and touched state
        this.setupFormReactivity();

        console.log('form created', newForm.value);
    }

    private createFieldValidators(field: FormField<any>): any[] {
        const validators = [];

        // Add required validator if field is required
        if (field.required) {
            validators.push((control: any) => {
                if (!control.value || control.value === '' || (Array.isArray(control.value) && control.value.length === 0)) {
                    return { required: true };
                }
                return null;
            });
        }

        // Add custom validators if provided
        if (field.validation) {
            validators.push(...field.validation);
        }

        return validators;
    }

    private setupFormReactivity() {
        const currentForm = this.form();

        // Initial state
        this.formValid.set(currentForm.valid);
        this.formTouched.set(currentForm.touched);

        // Subscribe to form status changes
        currentForm.statusChanges.subscribe(() => {
            this.formValid.set(currentForm.valid);
            this.formTouched.set(currentForm.touched);
        });
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
            // Update reactive signals
            this.formValid.set(formInstance.valid);
            this.formTouched.set(formInstance.touched);
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
                    ?.formFieldGroups?.find((group) => group.id === groupId)
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

    // Get global-level validation errors
    getGlobalValidationErrors(): string[] {
        const form = this.form();
        if (!form || !form.errors) return [];

        const errors: string[] = [];
        Object.keys(form.errors).forEach((errorKey) => {
            const errorMessage = this.errorMessages[errorKey] ? this.errorMessages[errorKey](form.errors![errorKey]) : `Erreur de validation globale: ${errorKey}`;
            errors.push(errorMessage);
        });

        return errors;
    }

    // Check if form has global validation errors
    hasGlobalValidationErrors(): boolean {
        const form = this.form();
        return !!(form && form.errors && Object.keys(form.errors).length > 0);
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

    // Check if direct field (not in group) is invalid
    isDirectFieldInvalid(fieldName: string): boolean {
        const form = this.form();
        const control = form.get(fieldName);
        return !!(control && control.invalid && (control.dirty || control.touched));
    }

    // Get direct field error (not in group)
    getDirectFieldError(fieldName: string): string | null {
        const form = this.form();
        const control = form.get(fieldName);

        if (control && control.invalid && (control.dirty || control.touched)) {
            const errors = control.errors;
            if (errors) {
                const fieldLabel = this.structure()?.formFields?.find((field) => field.name === fieldName)?.label;
                const errorKey = Object.keys(errors)[0];
                return this.errorMessages[errorKey] ? `${fieldLabel} : ${this.errorMessages[errorKey](errors[errorKey])}` : 'Erreur de validation';
            }
        }
        return null;
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
        if (!field.options) return [];

        // If custom displayKey or compareKey are provided, return options as-is
        // PrimeNG will use the displayKey/compareKey for display and comparison
        if (field.displayKey || field.compareKey) {
            return field.options;
        }

        // If options are already objects with label/value structure, return as-is
        if (field.options.length > 0 && typeof field.options[0] === 'object' && field.options[0].label) {
            return field.options;
        }

        // For simple arrays or objects without displayKey/compareKey,
        // return as-is and let PrimeNG handle object comparison
        return field.options;
    }

    // Helper method to get option value based on compareKey or fallback to 'value' property
    getOptionValue(option: any, field: FormField<any>): any {
        if (field.compareKey) {
            return option[field.compareKey];
        }
        return option.value !== undefined ? option.value : option;
    }

    // Helper method to get option label based on displayKey or fallback to 'label' property
    getOptionLabel(option: any, field: FormField<any>): string {
        if (field.displayKey) {
            return option[field.displayKey];
        }
        return option.label !== undefined ? option.label : option.toString();
    }

    // Helper method to get sorted fields within a group
    getSortedFieldsInGroup(group: FormFieldGroup): FormField<any>[] {
        return [...group.fields].sort((a, b) => {
            const orderA = a.order ?? 999999;
            const orderB = b.order ?? 999999;
            return orderA - orderB;
        });
    }

    // Helper method to check if an element is a FormField
    isFormField(element: FormField<any> | FormFieldGroup): element is FormField<any> {
        return 'name' in element && 'type' in element;
    }

    // Helper method to check if an element is a FormFieldGroup
    isFormFieldGroup(element: FormField<any> | FormFieldGroup): element is FormFieldGroup {
        return 'fields' in element && Array.isArray((element as FormFieldGroup).fields);
    }

    // Track function for @for loops
    trackByFieldId(index: number, field: FormField<any>): string {
        return field.id;
    }

    trackByGroupId(index: number, group: FormFieldGroup): string {
        return group.id;
    }

    // Track function for unified elements
    trackByElementId(index: number, element: FormField<any> | FormFieldGroup): string {
        return this.isFormField(element) ? element.id : (element as FormFieldGroup).id;
    }

    onCancelClick() {
        this.onCancel.emit();
        console.log('onCancelClick', this.form().value);
    }
}
