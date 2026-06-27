# Testnet Hint Feature

## Overview

The Testnet Hint feature provides contextual guidance to developers working on Stellar's testnet. It displays helpful information about Friendbot (the testnet faucet) and links to relevant documentation when testnet wallets are detected.

## Features

- **Automatic Detection**: Shows hint only when testnet wallets are present
- **Two Variants**: Default (full) and compact (inline) versions
- **Dismissible**: Users can dismiss the hint locally (not persisted)
- **Accessible**: Proper ARIA labels and semantic HTML
- **Dark Mode**: Full dark mode support
- **Security**: Proper external link handling with `rel="noopener noreferrer"`

## Architecture

### Components

#### `TestnetHint` Component
Located in `/src/components/ui/TestnetHint.tsx`

Displays contextual information about Stellar testnet and Friendbot.

**Props:**
- `variant?: "default" | "compact"` - Display variant (default: "default")
- `dismissible?: boolean` - Allow user to dismiss (default: true)
- `className?: string` - Additional CSS classes

**Behavior:**
- Renders nothing when dismissed
- Local state only (not persisted to storage)
- Parent component responsible for conditional rendering based on network

### Utilities

#### `friendbot.ts`
Located in `/src/utils/friendbot.ts`

Provides utilities for Friendbot integration.

**Exports:**
- `FRIENDBOT_URL` - Friendbot faucet URL
- `FRIENDBOT_DOCS_URL` - Stellar testnet documentation URL
- `getFriendbotUrl(address)` - Generate Friendbot funding URL
- `isFriendbotEligible(network)` - Check if network is testnet
- `isValidAddressForFriendbot(address)` - Validate Stellar address

## Integration

### WalletTable Integration

The `TestnetHint` is automatically shown in `WalletTable` when testnet wallets are present:

```tsx
export function WalletTable({ wallets }: WalletTableProps) {
	const hasTestnetWallets = useMemo(
		() => wallets.some((wallet) => wallet.network === "testnet"),
		[wallets],
	);

	return (
		<div className="space-y-4">
			{hasTestnetWallets && <TestnetHint variant="default" />}
			{/* Table content */}
		</div>
	);
}
```

### Usage Examples

#### Default Variant
```tsx
import { TestnetHint } from "@/components/ui/TestnetHint";

export function MyComponent() {
	return <TestnetHint />;
}
```

#### Compact Variant
```tsx
<TestnetHint variant="compact" />
```

#### Non-Dismissible
```tsx
<TestnetHint dismissible={false} />
```

#### Custom Styling
```tsx
<TestnetHint className="my-custom-class" />
```

## State Management

### Local State
- Dismissal state is **local to the component instance**
- Not persisted to localStorage or session storage
- Resets on page reload or component remount
- Each component instance maintains independent state

### Rationale
- Keeps the feature simple and stateless
- Avoids localStorage complexity
- Ensures hint reappears on page refresh (good for development)
- Can be enhanced later with persistent storage if needed

## Friendbot Integration

### What is Friendbot?
Friendbot is the Stellar testnet faucet that provides test XLM to new accounts. It's essential for development and testing on testnet.

### URL Generation
```tsx
import { getFriendbotUrl } from "@/utils/friendbot";

const address = "GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI";
const url = getFriendbotUrl(address);
// Returns: https://friendbot.stellar.org/?addr=GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI
```

### Eligibility Check
```tsx
import { isFriendbotEligible } from "@/utils/friendbot";

isFriendbotEligible("testnet");  // true
isFriendbotEligible("mainnet");  // false
```

## Testing

### Unit Tests

#### Friendbot Utilities (`friendbot.test.ts`)
- URL generation with proper encoding
- Network eligibility checks
- Address validation
- Error handling for invalid inputs
- Constants validation

#### TestnetHint Component (`TestnetHint.test.tsx`)
- Rendering in both variants
- Dismissal functionality
- External link security attributes
- Accessibility attributes
- Dark mode support
- State management
- Custom className application

### Running Tests
```bash
npm run test
```

## Accessibility

- **ARIA Labels**: Dismiss button has `aria-label="Dismiss testnet hint"`
- **Semantic HTML**: Uses proper button elements with `type="button"`
- **Focus Management**: Buttons have focus-visible styles from Button component
- **Color Contrast**: Amber color scheme meets WCAG AA standards
- **Keyboard Navigation**: All interactive elements are keyboard accessible

## Security

- **External Links**: All external links use `target="_blank" rel="noopener noreferrer"`
- **URL Encoding**: Friendbot URLs properly encode address parameters
- **Input Validation**: Address validation before URL generation
- **No XSS**: No innerHTML or dangerouslySetInnerHTML usage

## Dark Mode

The component includes full dark mode support:
- Amber color scheme adapts for dark mode
- Text colors adjust for readability
- Background colors use dark-appropriate shades
- All interactive elements have dark mode variants

## Edge Cases & Error Handling

### Invalid Addresses
```tsx
import { isValidAddressForFriendbot } from "@/utils/friendbot";

isValidAddressForFriendbot("INVALID");  // false
isValidAddressForFriendbot("");         // false
isValidAddressForFriendbot(null);       // false
```

### Empty Address to getFriendbotUrl
```tsx
import { getFriendbotUrl } from "@/utils/friendbot";

getFriendbotUrl("");  // Throws: "Address cannot be empty"
```

### Stale Network State
The component relies on parent component to handle network switching. If network changes:
1. Parent component should re-render with new wallet data
2. `useMemo` in WalletTable recalculates `hasTestnetWallets`
3. TestnetHint is conditionally rendered based on new state

### Disconnected State
If wallets become unavailable:
1. `wallets` array becomes empty
2. `hasTestnetWallets` becomes false
3. TestnetHint is not rendered
4. Table shows empty state

## Future Enhancements

1. **Persistent Dismissal**: Store dismissal preference in localStorage
2. **Per-Network Hints**: Different hints for different networks
3. **Contextual Links**: Link directly to Friendbot with pre-filled address
4. **Analytics**: Track hint interactions and Friendbot clicks
5. **Customizable Content**: Allow configuration of hint text and links
6. **Animations**: Add entrance/exit animations
7. **Toast Notifications**: Show success message after Friendbot funding

## Troubleshooting

### Hint Not Showing
- Verify wallets have `network: "testnet"`
- Check that WalletTable is rendering with wallets
- Ensure TestnetHint component is imported correctly

### Hint Always Showing
- Check if all wallets are testnet
- Verify network property is correctly set
- Check for stale wallet data

### Links Not Working
- Verify FRIENDBOT_URL and FRIENDBOT_DOCS_URL constants
- Check browser console for errors
- Ensure external links are not blocked by CSP

## Related Features

- **ExplorerLink**: Links to Stellar Expert explorer
- **NetworkBadge**: Visual indicator of network (testnet/mainnet)
- **WalletTable**: Displays wallets with network information
- **StatusIndicator**: Shows wallet status (active/pending/inactive)

## Documentation

- [Stellar Testnet Docs](https://developers.stellar.org/docs/learn/fundamentals/testnet)
- [Friendbot Faucet](https://friendbot.stellar.org/)
- [Stellar Expert Explorer](https://stellar.expert/)
