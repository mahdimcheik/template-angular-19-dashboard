import { Component, signal } from '@angular/core';
import { FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Structure } from './related-models';
import { ConfigurableFormComponent } from './configurable-form.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-configurable-form-example',
    standalone: true,
    imports: [ConfigurableFormComponent, CommonModule],
    template: `
        <div class="p-6 bg-gray-50 min-h-screen all-around-container">
            <h1 class="text-3xl font-bold mb-6">Configurable Form Example - Unified Ordering</h1>

            <div class="mb-6 p-4 bg-blue-50 rounded-lg">
                <h2 class="text-lg font-semibold text-blue-800 mb-2">Example Features:</h2>
                <ul class="text-sm text-blue-700 space-y-1">
                    <li>✓ Unified ordering: Fields and groups mixed together using 'order' property</li>
                    <li>✓ All field types: text, email, number, textarea, select, multiselect, checkbox, radio, date, color</li>
                    <li>✓ Group-level and field-level validation</li>
                    <li>✓ Custom validation functions</li>
                    <li>✓ Responsive design with Tailwind CSS</li>
                </ul>
            </div>

            <!-- Example Controls -->
            <div class="mb-6 flex flex-wrap gap-4">
                <button (click)="switchToBasicExample()" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Basic Example</button>
                <button (click)="switchToAdvancedExample()" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Advanced Example</button>
                <button (click)="switchToUnifiedOrderingExample()" class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">Unified Ordering Demo</button>
                <button (click)="switchToFileUploadExample()" class="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700">File Upload Example</button>
                <button (click)="switchToGridLayoutExample()" class="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700">Grid Layout Example</button>
            </div>

            <!-- Current Example Info -->
            <div class="mb-6 p-4 bg-amber-50 rounded-lg">
                <h3 class="font-semibold text-amber-800">Current Example: {{ currentExampleName() }}</h3>
                <p class="text-sm text-amber-700 mt-1">{{ currentExampleDescription() }}</p>
            </div>

            <!-- Form Component -->
            <div class="test-container">
                <app-configurable-form [structure]="currentStructure()" (onFormSubmit)="handleFormSubmit($event)" (onCancel)="handleCancel()" #formComponent> </app-configurable-form>
            </div>

            <!-- Debug Panel -->
            <div class="mt-8 bg-white p-6 rounded-lg shadow-sm">
                <h2 class="text-xl font-semibold mb-4">Debug Information</h2>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Structured Form Values -->
                    <div>
                        <h3 class="font-medium text-gray-800 mb-2">Structured Form Values:</h3>
                        <pre class="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-60">{{ getStructuredValues() | json }}</pre>
                    </div>

                    <!-- Flattened Form Values -->
                    <div>
                        <h3 class="font-medium text-gray-800 mb-2">Flattened Form Values:</h3>
                        <pre class="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-60">{{ getFlattenedValues() | json }}</pre>
                    </div>
                </div>

                <!-- Form Status -->
                <div class="mt-4 p-4 bg-blue-50 rounded-md">
                    <h3 class="font-medium text-blue-800 mb-2">Form Status:</h3>
                    <ul class="text-sm text-blue-700 space-y-1">
                        <li>Form Valid: {{ isFormValid() }}</li>
                        <li>Form Touched: {{ isFormTouched() }}</li>
                        <li>Total Form Groups: {{ currentStructure().formFieldGroups?.length || 0 }}</li>
                        <li>Total Direct Fields: {{ currentStructure().formFields?.length || 0 }}</li>
                    </ul>
                </div>

                <!-- Last Submitted Values -->
                @if (lastSubmittedValues()) {
                    <div class="mt-4 p-4 bg-green-50 rounded-md">
                        <h3 class="font-medium text-green-800 mb-2">Last Submitted Values:</h3>
                        <pre class="bg-green-100 p-3 rounded text-sm overflow-auto max-h-40">{{ lastSubmittedValues() | json }}</pre>
                    </div>
                }

                <!-- Element Ordering Info -->
                <div class="mt-4">
                    <h3 class="font-medium text-gray-800 mb-2">Element Ordering (showing unified ordering):</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <h4 class="font-medium text-sm">Form Fields:</h4>
                            @for (field of currentStructure().formFields || []; track field.id) {
                                <div class="text-xs p-2 bg-blue-50 rounded">
                                    <strong>{{ field.label }}</strong> (Order: {{ field.order || 'unset' }})
                                </div>
                            }
                        </div>
                        <div class="space-y-2">
                            <h4 class="font-medium text-sm">Form Groups:</h4>
                            @for (group of currentStructure().formFieldGroups || []; track group.id) {
                                <div class="text-xs p-2 bg-green-50 rounded">
                                    <strong>{{ group.name }}</strong> (Order: {{ group.order || 'unset' }})
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class ConfigurableFormExampleComponent {
    // Signal to track form submission results
    lastSubmittedValues = signal<any>(null);

    // Basic Example Structure
    basicStructure: Structure = {
        id: 'basic-form',
        name: 'Basic Form',
        label: 'Basic Form',
        description: 'A simple form with basic fields',
        submitButtonLabel: 'Submit',
        cancelButtonLabel: 'Cancel',
        formFields: [
            {
                id: 'username',
                name: 'username',
                label: 'Username',
                type: 'text',
                placeholder: 'Enter your username',
                required: true,
                order: 1
            },
            {
                id: 'email',
                name: 'email',
                label: 'Email',
                type: 'email',
                placeholder: 'your@email.com',
                required: true,
                validation: [Validators.email],
                order: 2
            }
        ],
        formFieldGroups: [
            {
                id: 'preferences',
                name: 'Preferences',
                description: 'Your preferences',
                order: 3,
                fields: [
                    {
                        id: 'newsletter',
                        name: 'newsletter',
                        label: 'Subscribe to newsletter',
                        type: 'checkbox',
                        value: false,
                        order: 1
                    },
                    {
                        id: 'theme',
                        name: 'theme',
                        label: 'Theme',
                        type: 'select',
                        options: [
                            { label: 'Light', value: 'light' },
                            { label: 'Dark', value: 'dark' }
                        ],
                        value: 'light',
                        order: 2
                    }
                ]
            }
        ]
    };

    // Current example tracking
    currentExampleName = signal<string>('Basic Example');
    currentExampleDescription = signal<string>('A simple form with basic fields');
    currentStructure = signal<Structure>(this.basicStructure);

    // Advanced Example Structure
    advancedStructure: Structure = {
        id: 'advanced-form',
        name: 'Advanced Form',
        label: 'Advanced Form',
        description: 'A comprehensive form with all field types and validation',
        submitButtonLabel: 'Create Profile',
        cancelButtonLabel: 'Cancel',
        formFields: [
            {
                id: 'title',
                name: 'title',
                label: 'Profile Title',
                type: 'text',
                placeholder: 'Enter a title for your profile',
                required: true,
                order: 1,
                validation: [Validators.minLength(3), Validators.maxLength(50)]
            },
            {
                id: 'description',
                name: 'description',
                label: 'Description',
                type: 'textarea',
                placeholder: 'Tell us about yourself...',
                order: 5
            },
            {
                id: 'website',
                name: 'website',
                label: 'Website',
                type: 'text',
                placeholder: 'https://your-website.com',
                order: 6
            },
            {
                id: 'age',
                name: 'age',
                label: 'Age',
                type: 'number',
                placeholder: '25',
                order: 7
            },
            {
                id: 'birthdate',
                name: 'birthdate',
                label: 'Birth Date',
                type: 'date',
                required: true,
                order: 8
            },
            {
                id: 'favoriteColor',
                name: 'favoriteColor',
                label: 'Favorite Color',
                type: 'color',
                value: '#3B82F6',
                order: 9
            },
            {
                id: 'portfolio-file',
                name: 'portfolio',
                label: 'Portfolio File',
                type: 'file',
                placeholder: 'Upload your portfolio',
                required: false,
                accept: '.pdf,.doc,.docx,.zip',
                maxFileSize: 10000000, // 10MB
                multiple: false,
                mode: 'advanced',
                chooseLabel: 'Choose Portfolio',
                uploadLabel: 'Upload',
                cancelLabel: 'Cancel',
                emptyMessage: 'Drag and drop your portfolio file here',
                order: 10
            }
        ],
        formFieldGroups: [
            {
                id: 'personal-info',
                name: 'Personal Information',
                description: 'Your personal details',
                icon: 'pi pi-user',
                order: 2,
                fields: [
                    {
                        id: 'firstName',
                        name: 'firstName',
                        label: 'First Name',
                        type: 'text',
                        placeholder: 'John',
                        required: true,
                        order: 1
                    },
                    {
                        id: 'lastName',
                        name: 'lastName',
                        label: 'Last Name',
                        type: 'text',
                        placeholder: 'Doe',
                        required: true,
                        order: 2
                    },
                    {
                        id: 'gender',
                        name: 'gender',
                        label: 'Gender',
                        type: 'radio',
                        options: [
                            { label: 'Male', value: 'male' },
                            { label: 'Female', value: 'female' },
                            { label: 'Other', value: 'other' }
                        ],
                        order: 3
                    }
                ]
            },
            {
                id: 'skills',
                name: 'Skills & Experience',
                description: 'Your professional skills',
                icon: 'pi pi-briefcase',
                order: 3,
                fields: [
                    {
                        id: 'programmingLanguages',
                        name: 'programmingLanguages',
                        label: 'Programming Languages',
                        type: 'multiselect',
                        placeholder: 'Select languages you know',
                        options: [
                            { label: 'JavaScript', value: 'javascript' },
                            { label: 'TypeScript', value: 'typescript' },
                            { label: 'Python', value: 'python' },
                            { label: 'Java', value: 'java' },
                            { label: 'C#', value: 'csharp' },
                            { label: 'PHP', value: 'php' },
                            { label: 'Go', value: 'go' },
                            { label: 'Rust', value: 'rust' }
                        ],
                        order: 1
                    },
                    {
                        id: 'experienceLevel',
                        name: 'experienceLevel',
                        label: 'Experience Level',
                        type: 'select',
                        placeholder: 'Select your experience level',
                        options: [
                            { label: 'Beginner (0-1 years)', value: 'beginner' },
                            { label: 'Intermediate (2-5 years)', value: 'intermediate' },
                            { label: 'Advanced (5-10 years)', value: 'advanced' },
                            { label: 'Expert (10+ years)', value: 'expert' }
                        ],
                        required: true,
                        order: 2
                    },
                    {
                        id: 'remote',
                        name: 'remote',
                        label: 'Available for remote work',
                        type: 'checkbox',
                        value: true,
                        order: 3
                    }
                ]
            },
            {
                id: 'contact',
                name: 'Contact Information',
                description: 'How to reach you',
                icon: 'pi pi-envelope',
                order: 4,
                fields: [
                    {
                        id: 'email',
                        name: 'email',
                        label: 'Email',
                        type: 'email',
                        placeholder: 'john@example.com',
                        required: true,
                        validation: [Validators.email],
                        order: 1
                    },
                    {
                        id: 'phone',
                        name: 'phone',
                        label: 'Phone',
                        type: 'text',
                        placeholder: '+1 (555) 123-4567',
                        order: 2
                    },
                    {
                        id: 'linkedin',
                        name: 'linkedin',
                        label: 'LinkedIn Profile',
                        type: 'text',
                        placeholder: 'https://linkedin.com/in/johndoe',
                        order: 3
                    },
                    {
                        id: 'business-card',
                        name: 'businessCard',
                        label: 'Business Card',
                        type: 'file',
                        placeholder: 'Upload your business card',
                        required: false,
                        accept: 'image/*,.pdf',
                        maxFileSize: 2000000, // 2MB
                        multiple: false,
                        mode: 'advanced',
                        chooseLabel: 'Choose File',
                        uploadLabel: 'Upload',
                        cancelLabel: 'Cancel',
                        emptyMessage: 'Drag and drop your business card here',
                        order: 4
                    }
                ]
            }
        ],
        globalValidators: [this.validateProfile.bind(this)]
    };

    // Unified Ordering Demo Structure
    unifiedOrderingStructure: Structure = {
        id: 'unified-ordering-demo',
        name: 'Unified Ordering Demo',
        label: 'Unified Ordering Demo',
        description: 'Demonstrates fields and groups mixed together with unified ordering',
        submitButtonLabel: 'Save Configuration',
        cancelButtonLabel: 'Reset',
        formFields: [
            {
                id: 'intro-field',
                name: 'introField',
                label: 'Introduction Message',
                type: 'textarea',
                placeholder: 'Enter an introduction message that will appear first...',
                order: 1 // This will appear first
            },
            {
                id: 'company-name',
                name: 'companyName',
                label: 'Company Name',
                type: 'text',
                placeholder: 'Your company name',
                required: true,
                order: 3 // This will appear third (after intro field and user details group)
            },
            {
                id: 'priority-level',
                name: 'priorityLevel',
                label: 'Priority Level',
                type: 'select',
                placeholder: 'Select priority',
                options: [
                    { label: 'Low', value: 'low' },
                    { label: 'Medium', value: 'medium' },
                    { label: 'High', value: 'high' },
                    { label: 'Critical', value: 'critical' }
                ],
                required: true,
                order: 7 // This will appear seventh
            },
            {
                id: 'notifications-enabled',
                name: 'notificationsEnabled',
                label: 'Enable Notifications',
                type: 'checkbox',
                value: true,
                order: 9 // This will appear ninth
            },
            {
                id: 'conclusion-notes',
                name: 'conclusionNotes',
                label: 'Final Notes',
                type: 'textarea',
                placeholder: 'Any final notes or comments...',
                order: 11 // This will appear last
            }
        ],
        formFieldGroups: [
            {
                id: 'user-details',
                name: 'User Details',
                description: 'Basic user information',
                icon: 'pi pi-user',
                order: 2, // This will appear second
                fields: [
                    {
                        id: 'name',
                        name: 'name',
                        label: 'Full Name',
                        type: 'text',
                        placeholder: 'John Doe',
                        required: true,
                        order: 1
                    },
                    {
                        id: 'email',
                        name: 'email',
                        label: 'Email',
                        type: 'email',
                        placeholder: 'john@example.com',
                        required: true,
                        validation: [Validators.email],
                        order: 2
                    }
                ]
            },
            {
                id: 'project-settings',
                name: 'Project Settings',
                description: 'Configure your project settings',
                icon: 'pi pi-cog',
                order: 4, // This will appear fourth
                fields: [
                    {
                        id: 'project-type',
                        name: 'projectType',
                        label: 'Project Type',
                        compareKey: 'value',
                        type: 'radio',
                        options: [
                            { label: 'Web Application', value: 'web' },
                            { label: 'Mobile App', value: 'mobile' },
                            { label: 'Desktop App', value: 'desktop' },
                            { label: 'API Service', value: 'api' }
                        ],
                        required: true,
                        order: 1
                    },
                    {
                        id: 'technologies',
                        name: 'technologies',
                        label: 'Technologies',
                        type: 'multiselect',
                        placeholder: 'Select technologies',
                        options: [
                            { label: 'Angular', value: 'angular' },
                            { label: 'React', value: 'react' },
                            { label: 'Vue', value: 'vue' },
                            { label: 'Node.js', value: 'nodejs' },
                            { label: 'Python', value: 'python' },
                            { label: 'Java', value: 'java' }
                        ],
                        order: 2
                    }
                ]
            },
            {
                id: 'timeline',
                name: 'Project Timeline',
                description: 'Set your project timeline',
                icon: 'pi pi-calendar',
                order: 5, // This will appear fifth
                fields: [
                    {
                        id: 'start-date',
                        name: 'startDate',
                        label: 'Start Date',
                        type: 'date',
                        required: true,
                        order: 1
                    },
                    {
                        id: 'end-date',
                        name: 'endDate',
                        label: 'End Date',
                        type: 'date',
                        required: true,
                        order: 2
                    },
                    {
                        id: 'milestone-count',
                        name: 'milestoneCount',
                        label: 'Number of Milestones',
                        type: 'number',
                        value: 3,
                        order: 3
                    }
                ]
            },
            {
                id: 'team-composition',
                name: 'Team Composition',
                description: 'Define your team structure',
                icon: 'pi pi-users',
                order: 6, // This will appear sixth
                fields: [
                    {
                        id: 'team-size',
                        name: 'teamSize',
                        label: 'Team Size',
                        type: 'select',
                        placeholder: 'Select team size',
                        options: [
                            { label: 'Solo (1 person)', value: '1' },
                            { label: 'Small (2-5 people)', value: '2-5' },
                            { label: 'Medium (6-15 people)', value: '6-15' },
                            { label: 'Large (16+ people)', value: '16+' }
                        ],
                        required: true,
                        order: 1
                    },
                    {
                        id: 'roles-needed',
                        name: 'rolesNeeded',
                        label: 'Roles Needed',
                        type: 'multiselect',
                        placeholder: 'Select required roles',
                        options: [
                            { label: 'Frontend Developer', value: 'frontend' },
                            { label: 'Backend Developer', value: 'backend' },
                            { label: 'Full Stack Developer', value: 'fullstack' },
                            { label: 'UI/UX Designer', value: 'designer' },
                            { label: 'DevOps Engineer', value: 'devops' },
                            { label: 'QA Tester', value: 'qa' },
                            { label: 'Project Manager', value: 'pm' }
                        ],
                        order: 2
                    }
                ]
            },
            {
                id: 'budget-info',
                name: 'Budget Information',
                description: 'Set your budget parameters',
                icon: 'pi pi-dollar',
                order: 8, // This will appear eighth
                fields: [
                    {
                        id: 'budget-range',
                        name: 'budgetRange',
                        label: 'Budget Range',
                        type: 'select',
                        placeholder: 'Select budget range',
                        options: [
                            { label: 'Under $10,000', value: 'under-10k' },
                            { label: '$10,000 - $50,000', value: '10k-50k' },
                            { label: '$50,000 - $100,000', value: '50k-100k' },
                            { label: '$100,000 - $500,000', value: '100k-500k' },
                            { label: 'Over $500,000', value: 'over-500k' }
                        ],
                        required: true,
                        order: 1
                    },
                    {
                        id: 'currency',
                        name: 'currency',
                        label: 'Currency',
                        type: 'select',
                        options: [
                            { label: 'USD ($)', value: 'usd' },
                            { label: 'EUR (€)', value: 'eur' },
                            { label: 'GBP (£)', value: 'gbp' },
                            { label: 'CAD ($)', value: 'cad' }
                        ],
                        value: 'usd',
                        required: true,
                        order: 2
                    }
                ]
            },
            {
                id: 'additional-features',
                name: 'Additional Features',
                description: 'Optional features and requirements',
                icon: 'pi pi-star',
                order: 10, // This will appear tenth
                fields: [
                    {
                        id: 'security-requirements',
                        name: 'securityRequirements',
                        label: 'Security Requirements',
                        type: 'multiselect',
                        placeholder: 'Select security requirements',
                        options: [
                            { label: 'Authentication', value: 'auth' },
                            { label: 'Authorization', value: 'authz' },
                            { label: 'Data Encryption', value: 'encryption' },
                            { label: 'GDPR Compliance', value: 'gdpr' },
                            { label: 'Security Audit', value: 'audit' }
                        ],
                        order: 1
                    },
                    {
                        id: 'performance-requirements',
                        name: 'performanceRequirements',
                        label: 'Performance Requirements',
                        type: 'checkbox',
                        value: false,
                        order: 2
                    },
                    {
                        id: 'scalability-factor',
                        name: 'scalabilityFactor',
                        label: 'Scalability Factor',
                        type: 'number',
                        value: 5,
                        order: 3
                    }
                ]
            }
        ],
        globalValidators: [this.validateDateRange.bind(this)]
    };

    // File Upload Example
    fileUploadExample: Structure = {
        id: 'file-upload-example',
        name: 'File Upload Example',
        label: 'File Upload Example',
        description: 'Demonstration of file upload functionality',
        formFields: [
            {
                id: 'single-file-upload',
                name: 'profilePicture',
                label: 'Profile Picture',
                type: 'file',
                placeholder: 'Select your profile picture',
                required: true,
                accept: 'image/*',
                maxFileSize: 5000000, // 5MB
                multiple: false,
                mode: 'advanced',
                chooseLabel: 'Choose Image',
                uploadLabel: 'Upload',
                cancelLabel: 'Cancel',
                emptyMessage: 'Drag and drop your profile picture here',
                order: 1
            },
            {
                id: 'multiple-files-upload',
                name: 'documents',
                label: 'Documents',
                type: 'file',
                placeholder: 'Select multiple documents',
                required: false,
                accept: '.pdf,.doc,.docx,.txt',
                maxFileSize: 10000000, // 10MB
                multiple: true,
                mode: 'advanced',
                chooseLabel: 'Choose Files',
                uploadLabel: 'Upload All',
                cancelLabel: 'Cancel',
                emptyMessage: 'Drag and drop your documents here',
                order: 2
            }
        ]
    };

    // Grid Layout Example
    gridLayoutExample: Structure = {
        id: 'grid-layout-example',
        name: 'Grid Layout Example',
        label: 'Grid Layout Example',
        description: 'Demonstrates horizontal field layout with fullWidth property',
        formFields: [
            {
                id: 'title-field',
                name: 'title',
                label: 'Article Title',
                type: 'text',
                placeholder: 'Enter article title',
                required: true,
                fullWidth: true, // This field will span the full width
                order: 1
            },
            {
                id: 'author-field',
                name: 'author',
                label: 'Author',
                type: 'text',
                placeholder: 'Author name',
                required: true,
                fullWidth: false, // This field will take half width (paired)
                order: 2
            },
            {
                id: 'category-field',
                name: 'category',
                label: 'Category',
                type: 'select',
                placeholder: 'Select category',
                required: true,
                fullWidth: false, // This field will take half width (paired with author)
                options: [
                    { label: 'Technology', value: 'tech' },
                    { label: 'Science', value: 'science' },
                    { label: 'Business', value: 'business' }
                ],
                order: 3
            },
            {
                id: 'tags-field',
                name: 'tags',
                label: 'Tags',
                type: 'text',
                placeholder: 'Enter tags separated by commas',
                required: false,
                fullWidth: false, // This field will take half width
                order: 4
            },
            {
                id: 'publish-date-field',
                name: 'publishDate',
                label: 'Publish Date',
                type: 'date',
                required: true,
                fullWidth: false, // This field will take half width (paired with tags)
                order: 5
            },
            {
                id: 'summary-field',
                name: 'summary',
                label: 'Summary',
                type: 'textarea',
                placeholder: 'Enter article summary',
                required: true,
                fullWidth: true, // Textarea automatically takes full width
                order: 6
            }
        ],
        formFieldGroups: [
            {
                id: 'settings-group',
                name: 'settings',
                label: 'Article Settings',
                description: 'Configure article visibility and notification settings',
                order: 7,
                fields: [
                    {
                        id: 'is-published',
                        name: 'isPublished',
                        label: 'Published',
                        type: 'checkbox',
                        placeholder: 'Publish this article immediately',
                        required: false,
                        fullWidth: false, // Checkbox takes half width
                        value: false
                    },
                    {
                        id: 'featured',
                        name: 'featured',
                        label: 'Featured',
                        type: 'checkbox',
                        placeholder: 'Mark as featured article',
                        required: false,
                        fullWidth: false, // Checkbox takes half width (paired)
                        value: false
                    },
                    {
                        id: 'notification-email',
                        name: 'notificationEmail',
                        label: 'Notification Email',
                        type: 'email',
                        placeholder: 'Enter email for notifications',
                        required: false,
                        fullWidth: true // Email field takes full width
                    },
                    {
                        id: 'priority',
                        name: 'priority',
                        label: 'Priority',
                        type: 'select',
                        placeholder: 'Select priority level',
                        required: false,
                        fullWidth: false, // Select takes half width
                        options: [
                            { label: 'Low', value: 'low' },
                            { label: 'Medium', value: 'medium' },
                            { label: 'High', value: 'high' }
                        ]
                    },
                    {
                        id: 'estimated-read-time',
                        name: 'estimatedReadTime',
                        label: 'Estimated Read Time (minutes)',
                        type: 'number',
                        placeholder: 'Enter estimated reading time',
                        required: false,
                        fullWidth: false, // Number field takes half width (paired with priority)
                        value: 5
                    }
                ]
            }
        ]
    };

    // Custom Validators
    validateProfile(control: AbstractControl): ValidationErrors | null {
        const values = control.value;
        if (!values) return null;

        // Example: If remote work is enabled, LinkedIn profile should be provided
        if (values.skills?.remote && !values.contact?.linkedin) {
            return { remoteRequiresLinkedIn: true };
        }

        return null;
    }

    validateDateRange(control: AbstractControl): ValidationErrors | null {
        const values = control.value;
        if (!values) return null;

        const startDate = values.timeline?.startDate;
        const endDate = values.timeline?.endDate;

        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            if (start >= end) {
                return { invalidDateRange: true };
            }
        }

        return null;
    }

    // Method to switch examples
    switchToBasicExample() {
        this.currentStructure.set(this.basicStructure);
        this.currentExampleName.set('Basic Example');
        this.currentExampleDescription.set('A simple form with basic fields and groups');
        this.lastSubmittedValues.set(null);
    }

    switchToAdvancedExample() {
        this.currentStructure.set(this.advancedStructure);
        this.currentExampleName.set('Advanced Example');
        this.currentExampleDescription.set('A comprehensive form with all field types, validation, and complex structure');
        this.lastSubmittedValues.set(null);
    }

    switchToUnifiedOrderingExample() {
        this.currentStructure.set(this.unifiedOrderingStructure);
        this.currentExampleName.set('Unified Ordering Demo');
        this.currentExampleDescription.set('Demonstrates fields and groups mixed together with unified ordering - notice how elements appear in order: Field(1) → Group(2) → Field(3) → Group(4) → etc.');
        this.lastSubmittedValues.set(null);
    }

    switchToFileUploadExample() {
        this.currentStructure.set(this.fileUploadExample);
        this.currentExampleName.set('File Upload Example');
        this.currentExampleDescription.set('Demonstrates file upload functionality with single and multiple file uploads');
        this.lastSubmittedValues.set(null);
    }

    switchToGridLayoutExample() {
        this.currentStructure.set(this.gridLayoutExample);
        this.currentExampleName.set('Grid Layout Example');
        this.currentExampleDescription.set('Demonstrates horizontal field layout with fullWidth property - fields are arranged in pairs except when fullWidth is true');
        this.lastSubmittedValues.set(null);
    }

    // Form submission handler
    handleFormSubmit(formGroup: FormGroup) {
        console.log('Form submitted:', formGroup.value);
        this.lastSubmittedValues.set(formGroup.value);

        // Show success message
        alert('Form submitted successfully! Check the debug panel for submitted values.');
    }

    // Form cancel handler
    handleCancel() {
        console.log('Form cancelled');
        this.lastSubmittedValues.set(null);
        alert('Form cancelled');
    }

    // Helper methods for debug panel
    getStructuredValues(): any {
        // This would be populated by the form component
        return this.lastSubmittedValues() || {};
    }

    getFlattenedValues(): any {
        const structured = this.getStructuredValues();
        if (!structured) return {};

        const flattened: any = {};
        Object.keys(structured).forEach((key) => {
            if (typeof structured[key] === 'object' && structured[key] !== null && !Array.isArray(structured[key])) {
                Object.keys(structured[key]).forEach((subKey) => {
                    flattened[subKey] = structured[key][subKey];
                });
            } else {
                flattened[key] = structured[key];
            }
        });

        return flattened;
    }

    isFormValid(): boolean {
        // This would be populated by the form component
        return true;
    }

    isFormTouched(): boolean {
        // This would be populated by the form component
        return false;
    }
}
