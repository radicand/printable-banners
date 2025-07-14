---
applyTo: '**/*.{ts,tsx}'
---

# Coding Standards

## Interface Placement

**Rule**: All TypeScript interfaces should be placed at the top of the file, immediately after imports and before any function definitions.

### ✅ Correct Pattern:

```tsx
import { SomeType } from './types';

interface ComponentProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
}

interface InternalComponentProps {
  readonly data: SomeType;
}

export default function Component({ value, onChange }: ComponentProps) {
  // component implementation
}

function InternalComponent({ data }: InternalComponentProps) {
  // internal component implementation
}
```

### ❌ Incorrect Pattern:

```tsx
import { SomeType } from './types';

export default function Component({ value, onChange }: ComponentProps) {
  // component implementation
}

// Don't place interfaces at the bottom
interface ComponentProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
}
```

### Rationale:

1. **Discoverability**: Interfaces at the top make the component's API immediately visible
2. **Consistency**: Follows the pattern established across the codebase
3. **TypeScript Convention**: Aligns with common TypeScript practices
4. **Readability**: Provides clear context before reading implementation

### Order Within File:

1. Imports
2. All interfaces (main component props first, then internal interfaces)
3. Main component function
4. Internal/helper functions

This standard applies to all `.tsx` and `.ts` files in the project.
