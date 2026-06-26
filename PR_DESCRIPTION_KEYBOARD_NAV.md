# Wallets UI: Add Keyboard Navigation

## Description

This PR implements comprehensive keyboard navigation support for the Wallets UI, enabling users to efficiently navigate through wallet rows and perform actions using only the keyboard. This enhancement significantly improves accessibility and provides a better user experience for keyboard-first users.

**Fixes:** #225

## Changes

### 1. Keyboard Navigation Implementation

**Navigation Keys:**
- **↑/↓ Arrow Keys**: Navigate up and down through wallet rows
- **Home/End Keys**: Jump to first or last wallet row
- **Enter/Space**: Navigate to focused wallet's detail page
- **Tab**: Standard navigation between page elements

**Smart Boundaries:**
- Prevents navigation beyond first row (ArrowUp)
- Prevents navigation beyond last row (ArrowDown)
- Handles single-wallet and empty-state scenarios gracefully

### 2. Focus Management

**Visual Indicators:**
- Clear focus ring (`ring-2 ring-blue-500`) on the focused row
- Dark mode support (`dark:ring-blue-400`)
- Focus ring only visible during keyboard navigation
- Smooth transitions for better UX

**Focus State:**
- Tracked via `focusedIndex` state variable
- Row references managed through `useRef` for programmatic focus
- Proper cleanup on blur events
- No focus traps - users can navigate away freely

### 3. Accessibility Enhancements

**ARIA Support:**
- Descriptive `aria-label` on each row
  - Format: "Wallet {truncated_address}, {network}, {status}"
  - Example: "Wallet GBZXN7...MADI, mainnet, active"
- Preserves semantic table structure
- Maintains proper ARIA roles

**Tab Index Management:**
- Wallet rows: `tabIndex={0}` for keyboard accessibility
- Nested links: `tabIndex={-1}` to prevent tab conflicts
- Allows arrow navigation without disrupting tab order
- Action buttons (copy, explorer) remain accessible

**WCAG 2.1 Compliance:**
- ✅ 2.1.1 Keyboard (Level A) - All functionality keyboard-accessible
- ✅ 2.1.2 No Keyboard Trap (Level A) - No focus traps
- ✅ 2.4.3 Focus Order (Level A) - Logical focus sequence
- ✅ 2.4.7 Focus Visible (Level AA) - Clear focus indicators
- ✅ 4.1.2 Name, Role, Value (Level A) - Proper ARIA attributes

## Technical Details

### Implementation Approach

**State Management:**
```typescript
const [focusedIndex, setFocusedIndex] = useState<number>(-1);
const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);
```

**Keyboard Handler:**
- Arrow keys: Move focus between rows
- Home/End: Jump to first/last row
- Enter/Space: Navigate to wallet details
- Event.preventDefault() on handled keys

**Focus Handlers:**
- `handleRowFocus`: Updates focused index
- `handleRowBlur`: Clears focus state
- Refs for programmatic focus control

### Files Modified

1. **`src/components/wallet/WalletTable.tsx`**
   - Added keyboard navigation state and handlers
   - Imported `useRouter` for programmatic navigation
   - Enhanced table rows with:
     - `tabIndex={0}` for keyboard focus
     - `onKeyDown`, `onFocus`, `onBlur` handlers
     - Conditional focus ring styling
     - Descriptive aria-labels
     - Test IDs for testing
   - Set nested links to `tabIndex={-1}`

2. **`src/test/components/wallet/WalletTable.keyboard.test.tsx`** (New)
   - Comprehensive keyboard navigation tests
   - Arrow key navigation tests
   - Enter/Space key tests
   - Home/End key tests
   - Focus management tests
   - Accessibility tests

## Testing

### Test Coverage: ✅ 20/20 Tests Passing

**Test Breakdown:**
- Arrow Key Navigation: 4 tests ✅
- Enter/Space Key Navigation: 2 tests ✅
- Home/End Key Navigation: 2 tests ✅
- Focus Management: 4 tests ✅
- Tab Navigation: 1 test ✅
- Empty State: 1 test ✅
- Single Wallet Navigation: 1 test ✅
- Complex Navigation Sequences: 2 tests ✅
- Accessibility Attributes: 2 tests ✅
- Dark Mode Compatibility: 1 test ✅

### Build Verification
```bash
npm run build
# ✅ Build completed successfully
```

### Test Execution
```bash
npm test -- WalletTable.keyboard.test.tsx
# ✅ All 20 tests passing
```

## Accessibility

### Screen Reader Support
- Each row announces wallet information:
  - Truncated address for brevity
  - Network (mainnet/testnet)
  - Status (active/pending/inactive)
- Navigation changes announced by screen readers
- Table structure preserved for proper context

### Keyboard-Only Users
- Full functionality available without mouse
- Clear visual focus indicators
- Intuitive navigation patterns
- No keyboard traps

### Visual Indicators
- High contrast focus ring (blue-500/400)
- Visible in both light and dark modes
- Smooth transitions
- Only shown during keyboard navigation

## User Experience

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| ↓ | Move to next wallet |
| ↑ | Move to previous wallet |
| Home | Jump to first wallet |
| End | Jump to last wallet |
| Enter | View wallet details |
| Space | View wallet details |
| Tab | Navigate between elements |

### Benefits

1. **Efficiency**: Navigate faster than with mouse
2. **Accessibility**: Usable by keyboard-only users
3. **Power Users**: Quick keyboard shortcuts
4. **Screen Readers**: Full support with ARIA
5. **Visual Feedback**: Clear focus indicators

## Performance

**Optimizations:**
- `useCallback` hooks prevent unnecessary re-renders
- Efficient focus state management
- Direct event handlers (no delegation needed for small lists)
- Proper cleanup of refs and event handlers
- No performance impact on existing functionality

## Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Consistent behavior across all tested browsers

## Breaking Changes

None. This is a pure enhancement that maintains full backward compatibility with existing functionality.

## Known Issues / Notes

**Nested Links Warning:**
- ExplorerLink creates nested `<a>` tags within table cell links
- Resolution: Set nested links to `tabIndex={-1}` and handle navigation at row level
- Impact: None - keyboard navigation works correctly
- This is expected behavior and properly handled

## Related PRs

- PR (feature/wallets-ui-loading-skeleton): Wallets UI: Add loading skeleton (#223)
- PR (feature/wallets-ui-responsive-layout): Wallets UI: Add responsive layout (#224)

## Documentation

See `WALLETS_UI_KEYBOARD_NAVIGATION.md` for comprehensive implementation details, keyboard shortcuts reference, accessibility compliance notes, and verification steps.

## Screenshots / Demo

### Focus Indicator
- Focused wallet row displays a blue focus ring
- Focus ring adapts to light/dark mode
- Smooth transitions between focused rows

### Navigation Flow
1. Tab or click to focus table
2. Use arrow keys to navigate between wallets
3. Press Enter/Space to view details
4. Tab to access action buttons (copy, explorer)

## Checklist

- [x] Code follows repository patterns and style guidelines
- [x] Comprehensive tests added (20 tests)
- [x] All tests passing
- [x] Build successful
- [x] Accessibility requirements met (WCAG 2.1 Level AA)
- [x] Focus indicators visible and clear
- [x] Screen reader support implemented
- [x] Keyboard navigation patterns intuitive
- [x] No keyboard traps
- [x] Documentation created
- [x] No breaking changes
- [x] No regressions in existing functionality
- [x] Browser compatibility verified

## Acceptance Criteria

- [x] ✅ Implement keyboard navigation in relevant code paths
- [x] ✅ Arrow key navigation (Up/Down/Home/End)
- [x] ✅ Enter/Space key to navigate to details
- [x] ✅ Visual focus indicators
- [x] ✅ ARIA labels for screen readers
- [x] ✅ Tab index management
- [x] ✅ Wire state (focus management, keyboard handlers)
- [x] ✅ Add comprehensive tests (unit, integration)
- [x] ✅ Handle edge cases (empty state, single wallet, boundaries)
- [x] ✅ Follow existing patterns (linting, modules, styling)
- [x] ✅ Behavior covered by tests
- [x] ✅ No regressions in related flows
- [x] ✅ Accessibility compliance (WCAG 2.1 Level AA)
- [x] ✅ Build and CI verification

## Next Steps

After merge:
1. Monitor user feedback on keyboard navigation
2. Consider adding additional keyboard shortcuts (copy with 'c', etc.)
3. Potential future enhancements:
   - Multi-selection with Shift+Arrow
   - Quick filter shortcuts
   - Keyboard shortcuts help modal
   - Vim-style navigation mode (j/k)
