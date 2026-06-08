# Testnet Hint Feature - Implementation Guide

## Overview

This guide documents the implementation of the "Show Friendbot Hint on Testnet" feature for the Mux Protocol frontend. The feature provides contextual guidance to developers working on Stellar's testnet by displaying helpful information about Friendbot (the testnet faucet).

## Implementation Summary

### Files Created

1. **Utilities**
   - `src/utils/friendbot.ts` - Friendbot URL generation and validation utilities
   - `src/utils/__tests__/friendbot.test.ts` - Comprehensive unit tests for friendbot utilities

2. **Components**
   - `src/components/ui/TestnetHint.tsx` - Reusable TestnetHint component with two variants
   - `src/components/ui/__tests__/TestnetHint.test.tsx` - Component unit tests
   - `src/components/wallet/__tests__/WalletTable.integration.test.tsx` - Integration tests

3. **Documentation**
   - `TESTNET_HINT_FEATURE.md` - Feature documentation
   - `IMPLEMENTATION_GUIDE.md` - This file

### Files Modified

1. **Components**
   - `src/components/wallet/WalletTable.tsx` - Integrated TestnetHint component

## Architecture Decisions

### 1. Component-Based Approach
**Decision**: Create a reusable `TestnetHint` component instead of inline logic.

**Rationale**:
- Promotes reusability across multiple pages
- Easier to test in isolation
- Cleaner separation of concerns
- Can be used in different contexts (wallets page, dashboard, etc.)

### 2. Two Variants
**Decision**: Provide both "default" and "compact" variants.

**Rationale**:
- Default variant for prominent placement (e.g., above wallet table)
- Compact variant for inline usage (e.g., in table headers or sidebars)
- Flexibility for different UI contexts

### 3. Local State Only
**Decision**: Dismissal state is local to component instance, not persisted.

**Rationale**:
- Keeps implementation simple and stateless
- Avoids localStorage complexity
- Ensures hint reappears on page refresh (good for development)
- Can be enhanced later with persistent storage if needed

### 4. Automatic Detection in WalletTable
**Decision**: Use `useMemo` to detect testnet wallets and conditionally render hint.

**Rationale**:
- Efficient computation (only recalculates when wallets change)
- Automatic visibility based on data
- No manual prop passing required
- Follows React best practices

### 5. Utility Functions
**Decision**: Separate friendbot logic into utility functions.

**Rationale**:
- Reusable across components
- Easier to test
- Encapsulates Friendbot-specific logic
- Can be used in other contexts (e.g., API calls, validation)

## State Management

### Component State
```tsx
const [isDismissed, setIsDismissed] = useState(false);
```

- **Scope**: Local to component instance
- **Persistence**: None (resets on remount)
- **Rationale**: Simplicity, no side effects

### Wallet Detection
```tsx
const hasTestnetWallets = useMemo(
	() => wallets.some((wallet) => wallet.network === "testnet"),
	[wallets],
);
```

- **Scope**: Computed from props
- **Optimization**: Memoized to prevent unnecessary recalculations
- **Dependency**: Only recalculates when `wallets` array changes

## Testing Strategy

### Unit Tests

#### Friendbot Utilities (`friendbot.test.ts`)
- ✅ URL generation with proper encoding
- ✅ Network eligibility checks
- ✅ Address validation (valid/invalid cases)
- ✅ Error handling (empty addresses, null/undefined)
- ✅ Constants validation

#### TestnetHint Component (`TestnetHint.test.tsx`)
- ✅ Rendering in both variants
- ✅ Dismissal functionality
- ✅ External link security attributes
- ✅ Accessibility attributes (ARIA labels)
- ✅ Dark mode support
- ✅ State management (independent instances)
- ✅ Custom className application

#### WalletTable Integration (`WalletTable.integration.test.tsx`)
- ✅ TestnetHint visibility based on wallet network
- ✅ Hint not shown for mainnet-only wallets
- ✅ Hint shown for testnet wallets
- ✅ Hint shown for mixed wallets
- ✅ Wallet rendering and display
- ✅ Edge cases (empty list, multiple testnet wallets)
- ✅ Dynamic updates when wallets change

### Test Coverage

**Total Test Cases**: 50+

**Coverage Areas**:
- Happy path scenarios
- Edge cases and error conditions
- Accessibility compliance
- Security attributes
- State management
- Component integration
- Responsive behavior

## Validation & Error Handling

### Input Validation

#### Address Validation
```tsx
// Valid: Starts with 'G', 56 characters, Base32 characters
/^G[A-Z2-7]{55}$/

// Invalid cases handled:
- Empty string
- null/undefined
- Wrong length
- Invalid characters
- Non-string types
```

#### Network Validation
```tsx
// Valid: "testnet" | "mainnet"
// Invalid cases handled:
- Other network names
- null/undefined
- Non-string types
```

### Error Handling

#### getFriendbotUrl
```tsx
// Throws error for:
- Empty address
- Whitespace-only address

// Handles:
- Special characters (URL encoded)
- Long addresses (properly encoded)
```

#### Component Rendering
```tsx
// Gracefully handles:
- Empty wallet list
- Mixed network wallets
- Dismissed state
- Missing props (uses defaults)
```

## Security Considerations

### External Links
```tsx
<a
	href={explorerUrl}
	target="_blank"
	rel="noopener noreferrer"
>
```

**Security Measures**:
- `target="_blank"` - Opens in new tab
- `rel="noopener noreferrer"` - Prevents window.opener access
- URL encoding - Prevents injection attacks

### Input Validation
- Stellar address format validation before URL generation
- No innerHTML or dangerouslySetInnerHTML usage
- No user input directly interpolated into URLs

### Type Safety
- Full TypeScript support
- Strict type checking enabled
- No `any` types used

## Accessibility

### ARIA Attributes
```tsx
aria-label="Dismiss testnet hint"
```

### Semantic HTML
```tsx
<button type="button">Dismiss</button>
```

### Focus Management
- Buttons have focus-visible styles
- Keyboard navigation supported
- Proper tab order

### Color Contrast
- Amber color scheme meets WCAG AA standards
- Dark mode variants provided
- No color-only information

## Performance Considerations

### Memoization
```tsx
const hasTestnetWallets = useMemo(
	() => wallets.some((wallet) => wallet.network === "testnet"),
	[wallets],
);
```

**Benefits**:
- Prevents unnecessary recalculations
- Avoids re-rendering when props haven't changed
- O(n) complexity only when wallets change

### Component Rendering
- Conditional rendering (hint only shown when needed)
- No unnecessary DOM nodes
- Efficient state updates

## Future Enhancements

### Phase 2: Persistent Dismissal
```tsx
// Store dismissal preference in localStorage
const [isDismissed, setIsDismissed] = useState(() => {
	return localStorage.getItem("testnet-hint-dismissed") === "true";
});

const handleDismiss = () => {
	setIsDismissed(true);
	localStorage.setItem("testnet-hint-dismissed", "true");
};
```

### Phase 3: Contextual Links
```tsx
// Pre-fill Friendbot with address
const friendbotUrlWithAddress = getFriendbotUrl(walletAddress);
```

### Phase 4: Analytics
```tsx
// Track hint interactions
const handleDismiss = () => {
	analytics.track("testnet_hint_dismissed");
	setIsDismissed(true);
};
```

### Phase 5: Customizable Content
```tsx
interface TestnetHintProps {
	title?: string;
	description?: string;
	friendbotUrl?: string;
	docsUrl?: string;
}
```

## Deployment Checklist

- [x] Code implementation complete
- [x] Unit tests written and passing
- [x] Integration tests written and passing
- [x] Documentation complete
- [x] Accessibility verified
- [x] Security review completed
- [x] Dark mode tested
- [x] Responsive design verified
- [ ] Code review completed
- [ ] Merged to main branch
- [ ] Deployed to staging
- [ ] Deployed to production

## Troubleshooting

### Hint Not Showing
**Checklist**:
1. Verify wallets have `network: "testnet"`
2. Check that WalletTable is rendering with wallets
3. Ensure TestnetHint component is imported correctly
4. Check browser console for errors

### Hint Always Showing
**Checklist**:
1. Check if all wallets are testnet
2. Verify network property is correctly set
3. Check for stale wallet data
4. Verify useMemo dependency array

### Links Not Working
**Checklist**:
1. Verify FRIENDBOT_URL and FRIENDBOT_DOCS_URL constants
2. Check browser console for errors
3. Ensure external links are not blocked by CSP
4. Test in different browsers

## Related Documentation

- [Testnet Hint Feature Documentation](./TESTNET_HINT_FEATURE.md)
- [Explorer Link Component Documentation](./EXPLORER_LINK_COMPONENT.md)
- [Stellar Testnet Docs](https://developers.stellar.org/docs/learn/fundamentals/testnet)
- [Friendbot Faucet](https://friendbot.stellar.org/)

## Code Review Checklist

- [ ] Code follows project conventions
- [ ] Tests are comprehensive and passing
- [ ] Documentation is clear and complete
- [ ] No console errors or warnings
- [ ] Accessibility standards met
- [ ] Security best practices followed
- [ ] Performance optimized
- [ ] Dark mode working correctly
- [ ] Responsive design verified
- [ ] No breaking changes to existing features

## Questions & Support

For questions about this implementation:
1. Review the feature documentation
2. Check the test files for usage examples
3. Review the component props and interfaces
4. Check the troubleshooting section
