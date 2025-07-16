# Configurable Grid Component

A fully configurable data grid component built with Angular 19, AG Grid Community, and Tailwind CSS.

## Features

- ✅ **Global Search**: Search across all columns with real-time filtering
- ✅ **Fully Configurable**: All data and configuration passed via inputs
- ✅ **Responsive Design**: Works perfectly on all screen sizes
- ✅ **Signal-based API**: Uses Angular 19's new signal-based input/output API
- ✅ **PrimeNG Integration**: Uses PrimeNG InputText for search functionality
- ✅ **AG Grid Community**: Leverages AG Grid's powerful features
- ✅ **Tailwind CSS**: Modern, responsive styling
- ✅ **TypeScript Support**: Full type safety with interfaces

## Usage

### Basic Usage

```typescript
import { ConfigurableGridComponent, IGridRow } from './configurable-grid.component';
import type { ColDef, GridOptions } from 'ag-grid-community';

@Component({
  imports: [ConfigurableGridComponent],
  template: `
    <app-configurable-grid
      [rowData]="data()"
      [columnDefs]="columns()"
      [gridOptions]="options()"
    ></app-configurable-grid>
  `
})
export class MyComponent {
  data = signal<IGridRow[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
  ]);

  columns = signal<ColDef[]>([
    { field: 'id', headerName: 'ID' },
    { field: 'name', headerName: 'Name' },
    { field: 'email', headerName: 'Email' }
  ]);

  options = signal<GridOptions>({
    rowHeight: 50,
    pagination: true
  });
}
```

### Advanced Usage

```typescript
<app-configurable-grid
  [rowData]="employeeData()"
  [columnDefs]="employeeColumns()"
  [gridOptions]="gridOptions()"
  [searchPlaceholder]="'Search employees...'"
  [showSearch]="true"
  [className]="'ag-theme-alpine h-[600px]'"
  (rowSelected)="onEmployeeSelected($event)"
></app-configurable-grid>
```

## Input Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `rowData` | `IGridRow[]` | `[]` | Array of data to display in the grid |
| `columnDefs` | `ColDef[]` | `[]` | AG Grid column definitions |
| `gridOptions` | `GridOptions` | `{}` | Additional AG Grid configuration options |
| `className` | `string` | `'ag-theme-alpine'` | CSS classes to apply to the grid container |
| `searchPlaceholder` | `string` | `'Search all columns...'` | Placeholder text for the search input |
| `showSearch` | `boolean` | `true` | Whether to show the search input |

## Output Events

| Event | Type | Description |
|-------|------|-------------|
| `rowSelected` | `RowSelectedEvent` | Emitted when a row is selected |

## Interfaces

### IGridRow

```typescript
export interface IGridRow {
  [key: string]: any;
}
```

A flexible interface that allows any object structure for row data.

## Styling

The component uses Tailwind CSS for styling and includes:

- Responsive design with mobile-first approach
- Dark mode support (if system preference is set)
- Customizable search input styling
- AG Grid theme integration

### Custom Styling

You can customize the appearance by:

1. **Modifying the SCSS file**: `configurable-grid.component.scss`
2. **Passing custom classes**: Use the `className` input
3. **Overriding Tailwind classes**: The component uses utility classes that can be customized

## Examples

### Employee Grid

```typescript
const employeeData = signal<IGridRow[]>([
  { id: 1, name: 'John Doe', email: 'john@example.com', department: 'Engineering', salary: 75000, active: true },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', department: 'Marketing', salary: 65000, active: true }
]);

const employeeColumns = signal<ColDef[]>([
  { field: 'id', headerName: 'ID', width: 80 },
  { field: 'name', headerName: 'Name', width: 150, sortable: true },
  { field: 'email', headerName: 'Email', width: 200, filter: true },
  { field: 'department', headerName: 'Department', width: 130 },
  { 
    field: 'salary', 
    headerName: 'Salary', 
    width: 120,
    valueFormatter: (params: any) => `$${params.value.toLocaleString()}`
  },
  { 
    field: 'active', 
    headerName: 'Active', 
    width: 100,
    cellRenderer: (params: any) => params.value ? '✅' : '❌'
  }
]);
```

### Product Grid

```typescript
const productData = signal<IGridRow[]>([
  { id: 1, name: 'Laptop', category: 'Electronics', price: 999.99, stock: 50 },
  { id: 2, name: 'Mouse', category: 'Electronics', price: 29.99, stock: 100 }
]);

const productColumns = signal<ColDef[]>([
  { field: 'id', headerName: 'ID', width: 80 },
  { field: 'name', headerName: 'Product Name', width: 200, sortable: true },
  { field: 'category', headerName: 'Category', width: 150, filter: true },
  { 
    field: 'price', 
    headerName: 'Price', 
    width: 120,
    valueFormatter: (params: any) => `$${params.value.toFixed(2)}`
  },
  { 
    field: 'stock', 
    headerName: 'Stock', 
    width: 100,
    cellStyle: (params: any) => params.value < 10 ? { color: 'red' } : {}
  }
]);
```

## Dependencies

- Angular 19+
- AG Grid Community
- PrimeNG (for InputText component)
- Tailwind CSS

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

When contributing to this component:

1. Maintain the signal-based API pattern
2. Keep the component fully configurable via inputs
3. Ensure responsive design works on all screen sizes
4. Add proper TypeScript types for all new features
5. Update this README for any new features or changes 