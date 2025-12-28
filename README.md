# React Virtual Merged List

A high-performance React component for rendering large, virtualized lists with **merged cells** (rowspans).

Built on top of `react-window`, this library combines the rendering speed of virtualization with the complex layout capabilities of data grids, automatically calculating rowspans based on your data.

![License](https://img.shields.io/npm/l/react-virtual-merged-list)
![Version](https://img.shields.io/npm/v/react-virtual-merged-list)
![Size](https://img.shields.io/bundlephobia/minzip/react-virtual-merged-list)

## Features

* 🚀 **Virtualized Rendering**: Efficiently handles thousands of rows without performance lag.
* 🧩 **Automatic Cell Merging**: Automatically calculates and renders rowspans based on duplicate data in your columns.
* 🎨 **Flexible Layout**: Define columns, widths, custom renderers, and styles easily.
* 🛡️ **TypeScript Native**: Fully typed for a robust developer experience.
* 📦 **Lightweight**: Zero bloat—it relies on `react-window` as a peer dependency.

## Installation

```bash
npm install react-virtual-merged-list
```

### Peer Dependencies

This library depends on `react` and `react-window`. Ensure they are installed in your project:

```bash
npm install react-window
```

## Usage

Here is a simple example showing how to render a list with merged "Department" and "Team" cells.

```tsx
import React from 'react';
import { MergedList } from 'react-virtual-merged-list';

const App = () => {
  // 1. Prepare your data (Must be sorted by the keys you want to merge!)
  const data = [
    { id: 1, department: 'Engineering', team: 'Backend', name: 'Alice' },
    { id: 2, department: 'Engineering', team: 'Backend', name: 'Bob' },
    { id: 3, department: 'Engineering', team: 'Frontend', name: 'Charlie' },
    { id: 4, department: 'Sales',       team: 'Enterprise', name: 'David' },
    { id: 5, department: 'Sales',       team: 'Enterprise', name: 'Eve' },
  ];

  return (
    <MergedList
      data={data}
      rowHeight={50}
      height={600}
      width="100%" // or a fixed number like 800
      columns={[
        { 
          key: 'department', 
          width: 150, 
          style: { fontWeight: 'bold', background: '#f5f5f5', color: '#333' }
        },
        { 
          key: 'team', 
          width: 150,
          style: { background: '#fafafa' }
        },
        { 
          key: 'name', 
          width: 200,
          // Custom render function for complex content
          render: (row) => (
             <span style={{ color: 'blue', paddingLeft: 10 }}>
               👤 {row.name}
             </span>
          ) 
        }
      ]}
    />
  );
};

export default App;
```

## Props

| Prop | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | `any[]` | **Yes** | The array of data objects to render. **Note:** Data should be sorted by the keys you intend to merge for correct visualization. |
| `columns` | `ColumnDef[]` | **Yes** | Configuration for the grid columns (see below). |
| `rowHeight` | `number` | **Yes** | Fixed height of each row in pixels. |
| `height` | `number` | **Yes** | Height of the scrollable container. |
| `width` | `number\|string` | **Yes** | Width of the container. |

### Column Configuration (`ColumnDef`)

The `columns` prop takes an array of objects with the following properties:

```typescript
interface ColumnDef {
  /** The key in your data object to bind to this column */
  key: string;
  
  /** Width of the column in pixels */
  width: number;
  
  /** Optional: Custom render function for cell content */
  render?: (row: any) => React.ReactNode;
  
  /** Optional: Inline styles applied to the cell container */
  style?: React.CSSProperties;
}
```

## How It Works

1. The component analyzes your `data` and the keys found in `columns`.
2. It calculates `rowSpan` values for consecutive identical values in those columns.
3. It uses `react-window` to render only the visible rows.
4. It uses absolute positioning to render merged cells ("Phantom Spacers" are handled internally, so you don't have to worry about flexbox layouts breaking).

## License

MIT © Nilesh Ingale