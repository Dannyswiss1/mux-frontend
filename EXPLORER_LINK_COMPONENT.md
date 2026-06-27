# Explorer Link Component

## Overview

The `ExplorerLink` component provides a reusable, accessible way to link to Stellar blockchain explorer for addresses and transactions. It handles validation gracefully and integrates seamlessly with the existing UI component library.

## Features

- **Stellar Address Validation**: Validates addresses before rendering links
- **Network Support**: Works with both mainnet and testnet
- **Graceful Degradation**: Renders as a disabled button for invalid addresses
- **Customizable**: Supports variants, sizes, labels, and custom styling
- **Accessible**: Proper ARIA attributes and semantic HTML
- **Type-Safe**: Full TypeScript support with proper type definitions

## Usage

### Basic Usage

```tsx
import { ExplorerLink } from "@/components/ui/ExplorerLink";

export function MyComponent() {
  return (
    <ExplorerLink
      address="GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI"
      network="mainnet"
    />
  );
}
```

### With Label

```tsx
<ExplorerLink
  address="GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI"
  network="mainnet"
  label="View on Explorer"
/>
```

### Custom Styling

```tsx
<ExplorerLink
  address="GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI"
  network="mainnet"
  variant="outline"
  size="lg"
  className="custom-class"
/>
```

### Without Icon

```tsx
<ExplorerLink
  address="GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI"
  network="mainnet"
  showIcon={false}
  label="View on Explorer"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `address` | `string` | Required | Stellar address or transaction hash |
| `network` | `"mainnet" \| "testnet"` | Required | Network to link to |
| `type` | `"account" \| "transaction" \| "address"` | `"account"` | Type of explorer link |
| `variant` | Button variant | `"ghost"` | Button style variant |
| `size` | Button size | `"sm"` | Button size |
| `showIcon` | `boolean` | `true` | Show external link icon |
| `label` | `string` | undefined | Optional text label |
| `className` | `string` | undefined | Additional CSS classes |
| `title` | `string` | undefined | Custom tooltip text |

## Behavior

### Valid Address
- Renders as a clickable link button
- Opens Stellar Expert explorer in a new tab
- Shows external link icon by default
- Supports custom labels and styling

### Invalid Address
- Renders as a disabled button
- Shows "Invalid address" tooltip
- Prevents accidental clicks
- Maintains consistent UI appearance

## Integration Examples

### In WalletTable

```tsx
<ExplorerLink
  address={wallet.address}
  network={wallet.network}
  type="account"
  size="icon-sm"
  showIcon
  title="View on Stellar Explorer"
/>
```

### In Transaction List

```tsx
<ExplorerLink
  address={transaction.hash}
  network={network}
  type="transaction"
  label={truncateHash(transaction.hash)}
/>
```

## Validation

The component uses Stellar address format validation:
- Addresses must start with 'G'
- Must be exactly 56 characters long
- Must contain only valid Base32 characters (A-Z, 2-7)

Transaction hashes must be:
- Exactly 64 characters long
- Valid hexadecimal (0-9, a-f, A-F)

## Explorer URLs

The component generates URLs for [Stellar Expert](https://stellar.expert/):

- **Mainnet Account**: `https://stellar.expert/explorer/public/account/{address}`
- **Testnet Account**: `https://stellar.expert/explorer/testnet/account/{address}`
- **Mainnet Transaction**: `https://stellar.expert/explorer/public/tx/{hash}`
- **Testnet Transaction**: `https://stellar.expert/explorer/testnet/tx/{hash}`

## Utilities

### `getExplorerUrl(identifier, network, type)`

Generates a full explorer URL for a given identifier.

```tsx
import { getExplorerUrl } from "@/utils/explorerUrl";

const url = getExplorerUrl(
  "GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI",
  "mainnet",
  "account"
);
// Returns: https://stellar.expert/explorer/public/account/GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI
```

### `isValidStellarAddress(address)`

Validates if a string is a valid Stellar address.

```tsx
import { isValidStellarAddress } from "@/utils/explorerUrl";

isValidStellarAddress("GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI"); // true
isValidStellarAddress("INVALID"); // false
```

### `isValidStellarTransaction(txHash)`

Validates if a string is a valid Stellar transaction hash.

```tsx
import { isValidStellarTransaction } from "@/utils/explorerUrl";

isValidStellarTransaction("a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1"); // true
isValidStellarTransaction("invalid"); // false
```

## Testing

The component includes comprehensive unit tests covering:
- Valid and invalid addresses
- Different networks (mainnet/testnet)
- Custom props (variant, size, label, etc.)
- Accessibility attributes
- Error states

Run tests with:
```bash
npm run test
```

## Accessibility

- Proper `title` attributes for tooltips
- Semantic HTML with `<a>` tags for links
- `rel="noopener noreferrer"` for security
- Disabled state for invalid addresses
- Focus-visible styles from Button component

## Security

- URL parameters are properly encoded with `encodeURIComponent()`
- External links use `target="_blank"` with `rel="noopener noreferrer"`
- Input validation prevents malformed URLs
- No user input is directly interpolated into URLs

## Future Enhancements

- Support for additional explorers (Horizon, StellarChain, etc.)
- Configurable explorer URLs
- Copy address to clipboard integration
- Transaction details modal
- Address book integration
