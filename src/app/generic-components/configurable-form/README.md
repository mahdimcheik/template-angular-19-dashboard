# Configurable Form Component

A modern Angular standalone component that dynamically renders forms based on a structured configuration object. Built with Angular 17+ features including standalone components, signals, and modern template syntax.

## Features

- ✅ **Standalone Component** - No module dependencies
- ✅ **Signal-based** - Modern reactive state management
- ✅ **Dynamic Form Generation** - Create forms from configuration objects
- ✅ **Nested FormGroups** - Each FormFieldGroup becomes its own FormGroup
- ✅ **Multiple Input Types** - Text, email, password, number, date, select, checkbox, radio, textarea
- ✅ **Form Validation** - Built-in and custom validators with error messages
- ✅ **Group-level Validation** - Cross-field validation within sections
- ✅ **Section-level Validation** - Validate individual sections independently
- ✅ **Grouped Fields** - Organize form fields into logical sections
- ✅ **Responsive Design** - Mobile-friendly layout with Tailwind CSS
- ✅ **Modern Template Syntax** - Uses @for, @if, @let control flow
- ✅ **Accessibility** - Proper labeling and ARIA attributes
- ✅ **Customizable Styling** - Support for custom CSS classes and icons

## Form Structure

The component creates a **nested FormGroup structure** where:
- The main form contains multiple FormGroups
- Each FormGroup represents a `FormFieldGroup` section
- Each section contains its own form controls
- Each section can have its own group-level validators

### Form Structure Example:
```typescript
// Instead of flat structure:
FormGroup {
  firstName: FormControl,
  lastName: FormControl,
  street: FormControl,
  city: FormControl
}

// Component creates nested structure:
FormGroup {
  'personal-info': FormGroup {
    firstName: FormControl,
    lastName: FormControl
  },
  'address-info': FormGroup {
    street: FormControl,
    city: FormControl
  }
}
```

## Installation

1. Ensure you have Angular 17+ installed
2. Copy the component files to your project:
   - `configurable-form.component.ts`
   - `configurable-form.component.html`
   - `configurable-form.component.scss`
   - `related-models.ts`

## Usage

### Basic Example

```typescript
import { Component } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Structure } from './related-models';
import { ConfigurableFormComponent } from './configurable-form.component';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [ConfigurableFormComponent],
  template: `
    <app-configurable-form 
      [structure]="formStructure" 
      (onFormSubmit)="handleFormSubmit($event)">
    </app-configurable-form>
  `
})
export class MyComponent {
  formStructure: Structure = {
    id: 'contact-form',
    name: 'Contact Form',
    description: 'Get in touch with us',
    icon: 'pi pi-envelope',
    formFieldGroups: [
      {
        id: 'contact-info',
        name: 'Contact Information',
        fields: [
          {
            id: 'name',
            name: 'name',
            label: 'Full Name',
            type: 'text',
            placeholder: 'Enter your full name',
            required: true,
            validation: [Validators.required, Validators.minLength(2)]
          },
          {
            id: 'email',
            name: 'email',
            label: 'Email',
            type: 'email',
            placeholder: 'your@email.com',
            required: true,
            validation: [Validators.required, Validators.email]
          }
        ]
      }
    ]
  };

  handleFormSubmit(formGroup: FormGroup) {
    // Structured values (nested by sections)
    const structuredValues = formGroup.value;
    console.log('Structured:', structuredValues);
    // Output: { "contact-info": { "name": "John", "email": "john@example.com" } }
    
    // Access specific section
    const contactInfo = formGroup.get('contact-info')?.value;
    console.log('Contact Info:', contactInfo);
    // Output: { "name": "John", "email": "john@example.com" }
    
    // Flatten if needed (all fields at root level)
    const flattenedValues = this.flattenFormValues(structuredValues);
    console.log('Flattened:', flattenedValues);
    // Output: { "name": "John", "email": "john@example.com" }
  }
  
  private flattenFormValues(structuredValues: any): any {
    const flattened: any = {};
    Object.keys(structuredValues).forEach(groupId => {
      const groupValue = structuredValues[groupId];
      Object.keys(groupValue).forEach(fieldName => {
        flattened[fieldName] = groupValue[fieldName];
      });
    });
    return flattened;
  }
}
```

## API Reference

### Input Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `structure` | `Structure \| null` | Yes | The form configuration object |

### Output Events

| Event | Type | Description |
|-------|------|-------------|
| `onFormSubmit` | `FormGroup` | Emitted when form is submitted and valid |

### Component Methods

The component exposes several methods for working with nested FormGroups:

```typescript
// Get FormGroup for a specific section
getFormGroup(groupId: string): FormGroup

// Get field error from nested FormGroup
getFieldError(groupId: string, fieldName: string): string | null

// Get group-level validation errors
getGroupValidationErrors(groupId: string): string[]

// Check if group has validation errors (not field errors)
hasGroupValidationErrors(groupId: string): boolean

// Check if field is invalid in nested FormGroup
isFieldInvalid(groupId: string, fieldName: string): boolean

// Check if entire FormGroup (section) is valid
isGroupValid(groupId: string): boolean

// Check if FormGroup (section) has been touched
isGroupTouched(groupId: string): boolean

// Get all errors for a FormGroup (section) - includes both field and group errors
getGroupErrors(groupId: string): string[]

// Get form values in structured format
getStructuredFormValue(): any

// Get flattened form values (original single-level structure)
getFlattenedFormValue(): any
```

### Data Models

#### Structure
```typescript
interface Structure {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  styleClass?: string;
  formFieldGroups: FormFieldGroup[];
}
```

#### FormFieldGroup
```typescript
interface FormFieldGroup {
  id: string;                    // Used as FormGroup name
  name: string;                  // Display name
  fields: FormField<any>[];      // Fields in this group
  description?: string;          // Section description
  icon?: string;                 // Section icon
  styleClass?: string;           // Custom CSS classes
  sectionId?: string;            // Additional identifier
  groupValidators?: ValidatorFn[]; // Group-level validators
}
```

#### FormField
```typescript
interface FormField<T> {
  id: string;
  label: string;
  name: string;                  // Used as FormControl name within group
  type: 'text' | 'number' | 'email' | 'password' | 'date' | 'checkbox' | 'radio' | 'select' | 'textarea';
  placeholder?: string;
  value?: T;
  disabled?: boolean;
  readonly?: boolean;
  options?: T[];
  required?: boolean;
  validation?: ValidatorFn[];
}
```

## Group Validators

Group validators allow you to validate relationships between multiple fields within a FormFieldGroup. They are applied at the FormGroup level and can access all fields within the group.

### Basic Group Validator

```typescript
import { AbstractControl, ValidationErrors } from '@angular/forms';

function passwordsMatch(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  
  if (password && confirmPassword && password !== confirmPassword) {
    return { passwordsDoNotMatch: true };
  }
  return null;
}

// Usage in FormFieldGroup
{
  id: 'password-section',
  name: 'Password',
  fields: [
    {
      id: 'password',
      name: 'password',
      label: 'Password',
      type: 'password',
      required: true,
      validation: [Validators.required, Validators.minLength(8)]
    },
    {
      id: 'confirmPassword',
      name: 'confirmPassword',
      label: 'Confirm Password',
      type: 'password',
      required: true,
      validation: [Validators.required]
    }
  ],
  groupValidators: [passwordsMatch]
}
```

### Common Group Validator Examples

#### 1. Password Confirmation
```typescript
passwordsMatch(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  
  if (password && confirmPassword && password !== confirmPassword) {
    return { passwordsDoNotMatch: true };
  }
  return null;
}
```

#### 2. Date Range Validation
```typescript
dateRangeValid(control: AbstractControl): ValidationErrors | null {
  const startDate = control.get('startDate')?.value;
  const endDate = control.get('endDate')?.value;
  
  if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
    return { invalidDateRange: true };
  }
  return null;
}
```

#### 3. Conditional Required Fields
```typescript
newsletterRequiresContactEmail(control: AbstractControl): ValidationErrors | null {
  const newsletter = control.get('newsletter')?.value;
  const contactEmail = control.get('contactEmail')?.value;
  
  if (newsletter && !contactEmail) {
    return { contactEmailRequired: true };
  }
  return null;
}
```

#### 4. Field Uniqueness
```typescript
namesShouldBeDifferent(control: AbstractControl): ValidationErrors | null {
  const firstName = control.get('firstName')?.value;
  const lastName = control.get('lastName')?.value;
  
  if (firstName && lastName && firstName.toLowerCase() === lastName.toLowerCase()) {
    return { namesShouldBeDifferent: true };
  }
  return null;
}
```

#### 5. Country-specific Validation
```typescript
postalCodeMatchesCountry(control: AbstractControl): ValidationErrors | null {
  const postalCode = control.get('postalCode')?.value;
  const country = control.get('country')?.value;
  
  if (postalCode && country) {
    if (country === 'France' && !/^\d{5}$/.test(postalCode)) {
      return { invalidFrenchPostalCode: true };
    }
    if (country === 'Belgium' && !/^\d{4}$/.test(postalCode)) {
      return { invalidBelgiumPostalCode: true };
    }
  }
  return null;
}
```

### Error Messages for Group Validators

Add error messages for your group validators in the `errorMessages` object:

```typescript
export const errorMessages: { [key: string]: (errValue: any) => string } = {
  // Field-level validation errors
  required: () => 'Ce champ est obligatoire.',
  email: () => 'Veuillez saisir une adresse e-mail valide.',
  
  // Group-level validation errors
  passwordsDoNotMatch: () => 'Les mots de passe ne correspondent pas.',
  invalidDateRange: () => 'La date de début doit être antérieure à la date de fin.',
  namesShouldBeDifferent: () => 'Le prénom et le nom doivent être différents.',
  contactEmailRequired: () => 'Un email de contact est requis si vous souhaitez recevoir la newsletter.',
  invalidFrenchPostalCode: () => 'Le code postal français doit contenir 5 chiffres.',
  invalidBelgiumPostalCode: () => 'Le code postal belge doit contenir 4 chiffres.',
};
```

## Working with Form Values

### Accessing Structured Values
```typescript
handleFormSubmit(formGroup: FormGroup) {
  const structuredValues = formGroup.value;
  
  // Access specific section
  const personalInfo = formGroup.get('personal-info')?.value;
  const addressInfo = formGroup.get('address-info')?.value;
  
  // Check section validity
  const isPersonalInfoValid = formGroup.get('personal-info')?.valid;
  const isAddressInfoValid = formGroup.get('address-info')?.valid;
  
  // Check for group-level validation errors
  const personalInfoErrors = formGroup.get('personal-info')?.errors;
  const addressInfoErrors = formGroup.get('address-info')?.errors;
}
```

### Flattening Values
```typescript
private flattenFormValues(structuredValues: any): any {
  const flattened: any = {};
  
  Object.keys(structuredValues).forEach(groupId => {
    const groupValue = structuredValues[groupId];
    Object.keys(groupValue).forEach(fieldName => {
      flattened[fieldName] = groupValue[fieldName];
    });
  });
  
  return flattened;
}
```

### Example Form Values

**Structured Format:**
```json
{
  "personal-info": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  },
  "address-info": {
    "street": "123 Main St",
    "city": "New York",
    "postalCode": "10001"
  }
}
```

**Flattened Format:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "street": "123 Main St",
  "city": "New York",
  "postalCode": "10001"
}
```

## Validation

### Field-level Validation
```typescript
{
  id: 'email',
  name: 'email',
  label: 'Email',
  type: 'email',
  required: true,
  validation: [Validators.required, Validators.email]
}
```

### Section-level Validation
```typescript
// Check if entire section is valid
const isPersonalInfoValid = formGroup.get('personal-info')?.valid;

// Get all errors in a section (field + group errors)
const personalInfoErrors = this.getGroupErrors('personal-info');

// Get only group-level validation errors
const groupValidationErrors = this.getGroupValidationErrors('personal-info');
```

### Custom Validators
```typescript
import { AbstractControl, ValidationErrors } from '@angular/forms';

function customValidator(control: AbstractControl): ValidationErrors | null {
  if (control.value && control.value.includes('test')) {
    return { containsTest: true };
  }
  return null;
}

// Usage
validation: [Validators.required, customValidator]
```

## Advanced Features

### Section Status Indicators
The component shows visual indicators for each section:
- ✅ Green checkmark when section is valid and touched
- ⚠️ Warning triangle when section has errors
- Error summary panel showing all errors in a section
- **Separate panels** for group-level vs field-level errors

### Form Status Summary
At the bottom of the form:
- Overall form validity status
- Visual indicators for form state

### Error Display
- **Group-level errors**: Red panel with detailed group validation errors
- **Field-level errors**: Orange panel with individual field errors
- **Inline field errors**: Individual error messages under each field

### Responsive Design
- Mobile-friendly layout
- Proper field sizing and spacing
- Responsive grid system

## Styling

The component uses Tailwind CSS classes for styling. You can customize the appearance by:

1. **Adding custom CSS classes** to the `styleClass` property
2. **Modifying the SCSS file** to change default styles
3. **Overriding CSS variables** in your global styles

### Custom CSS Classes
```typescript
formStructure: Structure = {
  id: 'my-form',
  name: 'My Form',
  styleClass: 'custom-form-style',
  formFieldGroups: [
    {
      id: 'group1',
      name: 'Group 1',
      styleClass: 'custom-group-style',
      fields: [...]
    }
  ]
};
```

## Migration from Flat Structure

If you were using the previous flat structure, you can easily migrate:

### Before (Flat):
```typescript
// Old way - single FormGroup
handleFormSubmit(formGroup: FormGroup) {
  const values = formGroup.value;
  // { firstName: "John", lastName: "Doe", street: "123 Main St" }
}
```

### After (Nested):
```typescript
// New way - nested FormGroups
handleFormSubmit(formGroup: FormGroup) {
  const structuredValues = formGroup.value;
  // { "personal-info": { firstName: "John", lastName: "Doe" }, "address-info": { street: "123 Main St" } }
  
  // Get flat values if needed
  const flatValues = this.flattenFormValues(structuredValues);
  // { firstName: "John", lastName: "Doe", street: "123 Main St" }
}
```

## Benefits of Nested Structure

1. **Better Organization**: Logical grouping of related fields
2. **Section-level Validation**: Validate parts of the form independently
3. **Group-level Validation**: Cross-field validation within sections
4. **Modular Form Handling**: Process different sections differently
5. **Improved UX**: Visual feedback per section
6. **Scalability**: Easy to add/remove sections
7. **Maintainability**: Clear separation of concerns

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This component is available under the MIT License. 