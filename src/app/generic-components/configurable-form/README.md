# Configurable Form Component

A modern Angular standalone component that dynamically renders forms based on a structured configuration object. Built with Angular 17+ features including standalone components, signals, and modern template syntax.

## Features

- ✅ **Standalone Component** - No module dependencies
- ✅ **Signal-based** - Modern reactive state management
- ✅ **Dynamic Form Generation** - Create forms from configuration objects
- ✅ **Multiple Input Types** - Text, email, password, number, date, select, checkbox, radio, textarea
- ✅ **Form Validation** - Built-in and custom validators with error messages
- ✅ **Grouped Fields** - Organize form fields into logical sections
- ✅ **Responsive Design** - Mobile-friendly layout with Tailwind CSS
- ✅ **Modern Template Syntax** - Uses @for, @if, @let control flow
- ✅ **Accessibility** - Proper labeling and ARIA attributes
- ✅ **Customizable Styling** - Support for custom CSS classes and icons

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
    console.log('Form submitted:', formGroup.value);
    // Handle form submission
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
  id: string;
  name: string;
  fields: FormField<any>[];
  description?: string;
  icon?: string;
  styleClass?: string;
  sectionId?: string;
}
```

#### FormField
```typescript
interface FormField<T> {
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
```

## Field Types

### Text Input
```typescript
{
  id: 'username',
  name: 'username',
  label: 'Username',
  type: 'text',
  placeholder: 'Enter username',
  required: true,
  validation: [Validators.required, Validators.minLength(3)]
}
```

### Email Input
```typescript
{
  id: 'email',
  name: 'email',
  label: 'Email Address',
  type: 'email',
  placeholder: 'your@email.com',
  required: true,
  validation: [Validators.required, Validators.email]
}
```

### Select Dropdown
```typescript
{
  id: 'country',
  name: 'country',
  label: 'Country',
  type: 'select',
  placeholder: 'Select a country',
  options: ['France', 'Germany', 'Spain', 'Italy'],
  required: true,
  validation: [Validators.required]
}
```

### Radio Buttons
```typescript
{
  id: 'gender',
  name: 'gender',
  label: 'Gender',
  type: 'radio',
  options: ['Male', 'Female', 'Other'],
  required: true,
  validation: [Validators.required]
}
```

### Checkbox
```typescript
{
  id: 'newsletter',
  name: 'newsletter',
  label: 'Newsletter',
  type: 'checkbox',
  placeholder: 'Subscribe to newsletter',
  value: false
}
```

### Textarea
```typescript
{
  id: 'message',
  name: 'message',
  label: 'Message',
  type: 'textarea',
  placeholder: 'Enter your message...',
  validation: [Validators.maxLength(500)]
}
```

## Validation

The component supports Angular's built-in validators and custom validators:

```typescript
import { Validators } from '@angular/forms';

// Built-in validators
validation: [
  Validators.required,
  Validators.email,
  Validators.minLength(3),
  Validators.maxLength(100),
  Validators.pattern(/^[a-zA-Z0-9]+$/)
]

// Custom validator
validation: [
  (control: AbstractControl) => {
    if (control.value && control.value.includes('test')) {
      return { containsTest: true };
    }
    return null;
  }
]
```

## Error Messages

Default error messages are provided in French, but you can customize them by modifying the `errorMessages` object in `related-models.ts`:

```typescript
export const errorMessages: { [key: string]: (errValue: any) => string } = {
  required: () => 'This field is required.',
  email: () => 'Please enter a valid email address.',
  minlength: (err) => `Minimum length is ${err.requiredLength} characters.`,
  maxlength: (err) => `Maximum length is ${err.requiredLength} characters.`,
  // Add your custom error messages here
};
```

## Styling

The component uses Tailwind CSS classes for styling. You can customize the appearance by:

1. **Adding custom CSS classes** to the `styleClass` property of `Structure` or `FormFieldGroup`
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

## Accessibility

The component includes accessibility features:

- Proper labeling with `for` attributes
- ARIA attributes for screen readers
- Keyboard navigation support
- Focus management
- Error announcements

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This component is available under the MIT License. 