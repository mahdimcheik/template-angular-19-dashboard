# Cursus Feature Module

This module provides a complete CRUD (Create, Read, Update, Delete) interface for managing educational courses (cursus) in the application.

## 🏗️ Architecture

The module follows Angular 17+ best practices with standalone components and modern patterns:

- **Standalone Components**: All components are standalone and self-contained
- **Signal-based State Management**: Uses Angular signals for reactive state
- **Inject Function**: Uses the `inject()` function instead of constructor-based DI
- **Typed Inputs/Outputs**: Fully typed component inputs and outputs
- **Route-level Code Splitting**: Components are lazy-loaded for better performance

## 📁 Folder Structure

```
src/app/modules/cursus/
├── components/
│   ├── cursus-list/                          # Main list component with DataTable
│   │   ├── cursus-list.component.ts
│   │   ├── cursus-list.component.html
│   │   └── cursus-list.component.scss
│   ├── cursus-detail/                        # Detail view component
│   │   ├── cursus-detail.component.ts
│   │   ├── cursus-detail.component.html
│   │   └── cursus-detail.component.scss
│   ├── modal-add-or-edit-cursus/            # Add/Edit modal component
│   │   ├── modal-add-or-edit-cursus.component.ts
│   │   ├── modal-add-or-edit-cursus.component.html
│   │   └── modal-add-or-edit-cursus.component.scss
│   └── modal-confirm-delete-cursus/         # Delete confirmation modal
│       ├── modal-confirm-delete-cursus.component.ts
│       ├── modal-confirm-delete-cursus.component.html
│       └── modal-confirm-delete-cursus.component.scss
├── pages/
│   └── cursus-page/                         # Page wrapper component
│       ├── cursus-page.component.ts
│       ├── cursus-page.component.html
│       └── cursus-page.component.scss
└── README.md
```

## 📊 Data Models

### CursusDTO
```typescript
export type CursusDTO = {
  id: string;
  name: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  createdAt: Date;
  updatedAt: Date;
};
```

### CreateCursusDto
```typescript
export type CreateCursusDto = {
  name: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
};
```

### UpdateCursusDto
```typescript
export type UpdateCursusDto = {
  id: string;
  name: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
};
```

## 🔧 Services

### CursusService
Located at: `src/app/shared/services/cursus.service.ts`

Provides CRUD operations:
- `getAllCursus()`: Fetch all cursus entries
- `getCursusById(id: string)`: Fetch a specific cursus
- `addCursus(cursus: CreateCursusDto)`: Create a new cursus
- `updateCursus(cursus: UpdateCursusDto)`: Update an existing cursus
- `deleteCursus(id: string)`: Delete a cursus

**Note**: Currently uses mock data for development. In production, replace with actual HTTP calls.

## 🎨 Components

### 1. CursusListComponent
**Purpose**: Displays all cursus entries in a sortable, filterable, and paginated table.

**Features**:
- PrimeNG DataTable with sorting, filtering, and pagination
- Global search functionality
- Action buttons for view, edit, and delete
- Responsive design with Tailwind CSS
- Loading and empty states

**Usage**:
```html
<app-cursus-list></app-cursus-list>
```

### 2. CursusDetailComponent
**Purpose**: Shows detailed information about a specific cursus.

**Features**:
- Comprehensive cursus information display
- Loading skeleton states
- Error handling
- Navigation back to list
- Edit functionality

**Usage**:
```html
<app-cursus-detail></app-cursus-detail>
```

**Route**: `/cursus/:id`

### 3. ModalAddOrEditCursusComponent
**Purpose**: Provides a side drawer form for creating or editing cursus entries.

**Features**:
- Reactive forms with validation
- Dynamic form based on add/edit mode
- Form validation with error messages
- Level and category dropdowns
- Success/error notifications

**Inputs**:
- `updateOrAdd`: 'update' | 'add'
- `cursusToChange`: CursusDTO | null
- `visibleRight`: boolean (two-way binding)

**Outputs**:
- `onClose`: boolean
- `actionEmitter`: void

### 4. ModalConfirmDeleteCursusComponent
**Purpose**: Provides a confirmation dialog for delete operations.

**Features**:
- Customizable title and message
- Confirm/cancel actions
- Modal dialog with proper styling

**Inputs**:
- `visible`: boolean (two-way binding)
- `title`: string
- `question`: string

**Outputs**:
- `onDeleteConfirmed`: void
- `onCancel`: void

## 🎯 Pipes

### CursusLevelPipe
Transforms level values to French labels:
- `beginner` → `Débutant`
- `intermediate` → `Intermédiaire`
- `advanced` → `Avancé`

### CursusLevelBadgePipe
Returns appropriate PrimeNG badge CSS classes based on level:
- `beginner` → `p-badge-success`
- `intermediate` → `p-badge-warning`
- `advanced` → `p-badge-danger`

### CursusLevelIconPipe
Returns appropriate PrimeNG icons based on level:
- `beginner` → `pi pi-star`
- `intermediate` → `pi pi-star-fill`
- `advanced` → `pi pi-crown`

## 🎨 Styling

The module uses:
- **Tailwind CSS**: For layout, spacing, and utility classes
- **PrimeNG**: For component styling and theming
- **Custom SCSS**: For component-specific styles

## 🚀 Usage Examples

### Basic Implementation
```typescript
// In your route configuration
{
  path: 'cursus',
  loadComponent: () => import('./modules/cursus/pages/cursus-page/cursus-page.component')
    .then(m => m.CursusPageComponent)
}
```

### Using Individual Components
```html
<!-- Display cursus list -->
<app-cursus-list></app-cursus-list>

<!-- Display cursus details -->
<app-cursus-detail></app-cursus-detail>

<!-- Add/Edit modal -->
<app-modal-add-or-edit-cursus 
  [updateOrAdd]="'add'"
  [(visibleRight)]="showModal"
  (actionEmitter)="onCursusUpdated()"
></app-modal-add-or-edit-cursus>
```

## 🔧 Configuration

### Categories
The available categories are defined in the `ModalAddOrEditCursusComponent`:
- Développement Frontend
- Développement Backend
- Langages de Programmation
- Base de Données
- DevOps
- Design
- Mobile
- Intelligence Artificielle

### Levels
Three levels are supported:
- Débutant (Beginner)
- Intermédiaire (Intermediate)
- Avancé (Advanced)

## 🌐 Internationalization

The module is currently in French. To add other languages:
1. Update the pipes to support multiple languages
2. Add translation keys to your i18n files
3. Update component templates to use translation keys

## 🔄 State Management

The module uses Angular signals for state management:
- `cursus` signal in `CursusService` holds the list of cursus
- Component-level signals for UI state (loading, modals, etc.)
- Reactive updates when data changes

## 📱 Responsive Design

The components are fully responsive:
- Mobile-first approach with Tailwind CSS
- Adaptive layouts for different screen sizes
- Touch-friendly interactions
- Optimized table display on mobile devices

## 🧪 Testing

To add tests:
1. Create `.spec.ts` files for each component
2. Test component interactions and state changes
3. Mock the `CursusService` for unit tests
4. Add integration tests for the complete flow

## 🔮 Future Enhancements

Potential improvements:
- Add search filters by category and level
- Implement bulk operations
- Add export functionality
- Implement real-time updates
- Add cursus prerequisites and relationships
- Implement cursus enrollment system 