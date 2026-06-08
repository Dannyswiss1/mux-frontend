# Address Format Helper Feature

## Overview

The Address Format Helper is a comprehensive utility library for formatting and manipulating Stellar addresses in various display formats. It provides six distinct formatting options optimized for different use cases: full display, truncated display, short display, chunked display, masked display, and grouped display.

This feature enables consistent address formatting across the Mux Protocol frontend while maintaining address integrity and supporting multiple presentation styles for different UI contexts.

## Problem Statement

Stellar addresses are 56-character strings that are difficult to read and display in UI contexts. Different parts of the application need different formatting strategies:

- **Display in tables**: Truncated format (6...4) for compact display
- **Copy operations**: Full format for accuracy
- **QR codes**: Grouped format for readability
- **Sensitive contexts**: Masked format to hide middle characters
- **Mobile displays**: Short format for space constraints
- **Accessibility**: Chunked format for screen readers

Without a centralized formatting utility, address display logic would be scattered across components, leading to inconsistencies and maintenance issues.

## Solution

A comprehensive address formatting utility (`src/utils/addressFormatter.ts`) that provides:

1. **Six formatting functions** for different display needs
2. **Validation** to ensure only valid Stellar addresses are formatted
3. **Batch operations** for formatting multiple addresses
4. **Address comparison** that ignores formatting
5. **Format extraction** to recover full addresses from any format
6. **Type safety** with TypeScript interfaces and types

## Format Types

### 1. Full Format
Returns the complete 56-character address unchanged.

**Use case**: Copy operations, API calls, storage

**Example**:
```
GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI
```

### 2. Truncated Format
Shows first 6 and last 4 characters with ellipsis (6...4 pattern).

**Use case**: Table displays, compact UI, transaction lists

**Example**:
```
GBZXN7...MADI
```

### 3. Short Format
Shows first 12 characters only.

**Use case**: Mobile displays, space-constrained layouts

**Example**:
```
GBZXN7PIRZGN
```

### 4. Chunked Format
Divides address into chunks (default 7 characters) separated by spaces.

**Use case**: QR code display, manual entry verification, accessibility

**Example**:
```
GBZXN7 PIRZGN MHGA7M UUUF4G WPY5AY PV6LY4 UV2GL6 VJGIQR XFDNMA DI
```

### 5. Masked Format
Shows first and last 12 characters with masked middle section.

**Use case**: Sensitive contexts, partial visibility, security

**Example**:
```
GBZXN7PIRZGN****MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI
```

### 6. Grouped Format
Divides address into groups (default 4 characters) separated by spaces.

**Use case**: Readable display, documentation, user-friendly presentation

**Example**:
```
GBZX N7PI RZGN MHGA 7MUU UF4G WPY5 AYPV 6LY4 UV2G L6VJ GIQR XFDN MADI
```

## API Reference

### Core Formatting Functions

#### `formatFull(address: string): string`
Returns the full address unchanged.

```typescript
const result = formatFull("GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI");
// Returns: "GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI"
```

#### `formatTruncated(address: string): string`
Formats address as 6...4 pattern.

```typescript
const result = formatTruncated("GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI");
// Returns: "GBZXN7...MADI"
```

#### `formatShort(address: string): string`
Returns first 12 characters.

```typescript
const result = formatShort("GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI");
// Returns: "GBZXN7PIRZGN"
```

#### `formatChunked(address: string, chunkSize?: number, separator?: string): string`
Divides address into chunks.

```typescript
const result = formatChunked("GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI", 7, " ");
// Returns: "GBZXN7 PIRZGN MHGA7M UUUF4G WPY5AY PV6LY4 UV2GL6 VJGIQR XFDNMA DI"
```

#### `formatMasked(address: string, maskChar?: string, visibleChars?: number): string`
Masks middle characters while showing prefix and suffix.

```typescript
const result = formatMasked("GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI", "*", 12);
// Returns: "GBZXN7PIRZGN****MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI"
```

#### `formatGrouped(address: string, groupSize?: number, separator?: string): string`
Divides address into groups.

```typescript
const result = formatGrouped("GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI", 4, " ");
// Returns: "GBZX N7PI RZGN MHGA 7MUU UF4G WPY5 AYPV 6LY4 UV2G L6VJ GIQR XFDN MADI"
```

### Main Formatting Function

#### `formatAddress(address: string, options?: AddressFormatterOptions): FormattedAddress`
Main function that formats an address according to specified options.

**Parameters**:
- `address`: The address to format
- `options`: Formatting options (optional)
  - `format`: Format type ("full" | "truncated" | "short" | "chunked" | "masked" | "grouped")
  - `chunkSize`: Size of chunks for chunked format (default: 7)
  - `separator`: Separator between chunks/groups (default: " ")
  - `maskChar`: Character for masking (default: "*")
  - `groupSize`: Size of groups for grouped format (default: 4)

**Returns**: `FormattedAddress` object with:
- `original`: Original input address
- `formatted`: Formatted address
- `format`: Format type used
- `isValid`: Whether the address is valid
- `error`: Error message if invalid

```typescript
const result = formatAddress("GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI", {
  format: "truncated"
});

// Returns:
// {
//   original: "GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI",
//   formatted: "GBZXN7...MADI",
//   format: "truncated",
//   isValid: true,
//   error: null
// }
```

### Batch Operations

#### `formatAddresses(addresses: string[], options?: AddressFormatterOptions): FormattedAddress[]`
Formats multiple addresses with the same options.

```typescript
const addresses = [
  "GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI",
  "GCFONE23AB7Y6C5YZOMKUKGETPIAJA752ZPMORQO5VKA6LHXHC7Y3YPE"
];

const results = formatAddresses(addresses, { format: "truncated" });
// Returns array of FormattedAddress objects
```

### Address Comparison

#### `compareAddresses(address1: string, address2: string): boolean`
Compares two addresses ignoring formatting and case.

```typescript
const result = compareAddresses(
  "GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI",
  "gbzxn7...madi"
);
// Returns: true
```

### Address Extraction

#### `extractFullAddress(address: string): string | null`
Extracts the full address from any format.

```typescript
const result = extractFullAddress("GBZXN7...MADI");
// Returns: "GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI"
```

### Utility Functions

#### `getFormatDescription(format: AddressFormatType): string`
Gets a human-readable description of a format type.

```typescript
const desc = getFormatDescription("truncated");
// Returns: "Truncated (6...4 pattern)"
```

#### `getAvailableFormats(): AddressFormatType[]`
Returns all available format types.

```typescript
const formats = getAvailableFormats();
// Returns: ["full", "truncated", "short", "chunked", "masked", "grouped"]
```

#### `validateFormattingOptions(options: AddressFormatterOptions): { isValid: boolean; error: string | null }`
Validates formatting options.

```typescript
const result = validateFormattingOptions({ chunkSize: 0 });
// Returns: { isValid: false, error: "chunkSize must be greater than 0" }
```

## Type Definitions

```typescript
export type AddressFormatType =
  | "full"
  | "truncated"
  | "short"
  | "chunked"
  | "masked"
  | "grouped";

export interface FormattedAddress {
  original: string;
  formatted: string;
  format: AddressFormatType;
  isValid: boolean;
  error: string | null;
}

export interface AddressFormatterOptions {
  format?: AddressFormatType;
  chunkSize?: number;
  separator?: string;
  maskChar?: string;
  groupSize?: number;
}
```

## Usage Examples

### Example 1: Display Address in Table
```typescript
import { formatAddress } from "@/utils/addressFormatter";

function AddressCell({ address }: { address: string }) {
  const result = formatAddress(address, { format: "truncated" });
  
  return (
    <span title={result.original}>
      {result.formatted}
    </span>
  );
}
```

### Example 2: Format for QR Code
```typescript
import { formatAddress } from "@/utils/addressFormatter";

function QRCodeDisplay({ address }: { address: string }) {
  const result = formatAddress(address, { 
    format: "chunked",
    chunkSize: 8,
    separator: "\n"
  });
  
  return <pre>{result.formatted}</pre>;
}
```

### Example 3: Batch Format Multiple Addresses
```typescript
import { formatAddresses } from "@/utils/addressFormatter";

function AddressList({ addresses }: { addresses: string[] }) {
  const formatted = formatAddresses(addresses, { format: "truncated" });
  
  return (
    <ul>
      {formatted.map((item) => (
        <li key={item.original}>
          {item.isValid ? item.formatted : "Invalid address"}
        </li>
      ))}
    </ul>
  );
}
```

### Example 4: Compare Addresses
```typescript
import { compareAddresses } from "@/utils/addressFormatter";

function isAddressMatch(userInput: string, storedAddress: string): boolean {
  return compareAddresses(userInput, storedAddress);
}
```

### Example 5: Extract Full Address
```typescript
import { extractFullAddress } from "@/utils/addressFormatter";

function processUserInput(input: string): string | null {
  const fullAddress = extractFullAddress(input);
  
  if (!fullAddress) {
    console.error("Invalid address format");
    return null;
  }
  
  return fullAddress;
}
```

## Integration Patterns

### With React Components
The formatter can be used directly in React components for display purposes:

```typescript
import { formatAddress } from "@/utils/addressFormatter";

export function WalletAddress({ address }: { address: string }) {
  const { formatted, isValid } = formatAddress(address, { format: "truncated" });
  
  if (!isValid) {
    return <span className="text-red-500">Invalid address</span>;
  }
  
  return <span className="font-mono">{formatted}</span>;
}
```

### With State Management
Store the original address and format on-demand:

```typescript
const [address, setAddress] = useState("GBZXN7...");

const displayAddress = useMemo(() => {
  return formatAddress(address, { format: "truncated" });
}, [address]);
```

### With API Responses
Always use full format for API operations:

```typescript
async function fetchWallet(address: string) {
  const { formatted: fullAddress } = formatAddress(address, { format: "full" });
  
  if (!fullAddress) {
    throw new Error("Invalid address");
  }
  
  return api.get(`/wallets/${fullAddress}`);
}
```

## Validation Rules

The formatter validates Stellar addresses using the following rules:

1. Must start with 'G'
2. Must be exactly 56 characters long
3. Must contain only valid Base32 characters (A-Z, 2-7)
4. Case-insensitive (automatically converted to uppercase)

Invalid addresses are returned unchanged with an error message.

## Error Handling

All functions handle errors gracefully:

- **Invalid input**: Returns error in `FormattedAddress.error`
- **Invalid options**: Returns validation error from `validateFormattingOptions`
- **Null/undefined**: Returns null or error object depending on function
- **Formatting errors**: Caught and returned as error message

## Performance Considerations

- All formatting functions are O(n) where n is address length
- Batch operations use `Array.map()` for efficiency
- Address comparison uses string cleaning and validation
- No external dependencies or network calls
- Suitable for high-frequency UI updates

## Testing

The formatter includes comprehensive test coverage:

- **60+ unit tests** covering all functions
- **Edge case tests** for invalid inputs, boundary conditions
- **Integration tests** for complete workflows
- **Type safety** verified through TypeScript

Run tests with:
```bash
npm run test -- addressFormatter.test.ts
```

## Browser Compatibility

The formatter uses only standard JavaScript features and is compatible with:

- All modern browsers (Chrome, Firefox, Safari, Edge)
- Node.js 14+
- React 16.8+

## Security Considerations

- No sensitive data is logged or stored
- Addresses are treated as public information
- Masked format provides visual obfuscation only, not cryptographic security
- All input is validated before processing

## Troubleshooting

### Address not formatting correctly
- Verify the address is valid (starts with 'G', 56 characters)
- Check that the format type is valid
- Use `extractFullAddress()` to recover the full address

### Comparison returning false for same address
- Ensure both addresses are valid Stellar addresses
- Check for leading/trailing whitespace
- Verify case doesn't matter (automatically handled)

### Batch formatting slow
- For very large batches (>10,000), consider chunking the array
- Use `formatAddresses()` instead of looping `formatAddress()`

## Future Enhancements

Potential improvements for future versions:

- Caching layer for frequently formatted addresses
- Custom format templates
- Localization support for format descriptions
- Integration with address book/alias system
- Format preference persistence

## Related Features

- **Address Validation** (`src/utils/addressValidation.ts`): Validates address copy format
- **Address Formatting** (`src/utils/addressFormatting.ts`): Existing truncation utility
- **Explorer Link** (`src/components/ui/ExplorerLink.tsx`): Links to blockchain explorer
- **Copy to Clipboard** (`src/hooks/useCopyToClipboard.ts`): Copy operations with validation

## Files

- `src/utils/addressFormatter.ts` - Main implementation
- `src/utils/__tests__/addressFormatter.test.ts` - Test suite
- `ADDRESS_FORMAT_HELPER_FEATURE.md` - This documentation
