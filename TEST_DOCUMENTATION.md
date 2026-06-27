# Network Badge Component Tests - Documentation

## Overview

This document outlines the comprehensive test suite for the Mux Protocol frontend network badge components and related wallet UI components. The tests ensure robust behavior, proper styling, accessibility compliance, and graceful handling of edge cases.

## Test Coverage

### 1. NetworkBadge Component Tests (`src/components/wallet/__tests__/NetworkBadge.test.tsx`)

#### Test Categories

**Rendering Tests**
- Verifies correct label display for testnet and mainnet networks
- Ensures component renders as a semantic span element
- Validates proper DOM structure

**Styling Tests**
- Validates network-specific color schemes (testnet: amber, mainnet: blue)
- Verifies dark mode styles are applied correctly
- Confirms outline variant styles are present
- Tests hover state styles

**Custom className Tests**
- Ensures custom classes merge with default styles
- Validates style override capability
- Tests multiple custom class handling

**Props Validation Tests**
- Confirms all valid network types are accepted
- Validates optional className prop handling

**Accessibility Tests**
- Verifies semantic HTML structure with `data-slot="badge"` attribute
- Ensures text content is visible and readable
- Validates text contrast with color combinations

**Edge Cases**
- Rapid re-renders with network switching
- Dynamic className changes
- Component lifecycle stability

**Integration Tests**
- Validates Badge component integration
- Confirms outline variant application
- Tests inherited base styles from Badge component

### 2. StatusIndicator Component Tests (`src/components/wallet/__tests__/StatusIndicator.test.tsx`)

#### Test Categories

**Rendering Tests**
- Verifies correct status labels (Active, Pending, Inactive)
- Validates dot indicator rendering
- Ensures proper component structure

**Styling Tests**
- Status-specific color schemes:
  - Active: Green (bg-green-50, text-green-700)
  - Pending: Yellow (bg-yellow-50, text-yellow-700)
  - Inactive: Zinc (bg-zinc-100, text-zinc-600)
- Dark mode styles for each status
- Pulse animation for pending status

**Dot Indicator Tests**
- Validates correct dot colors per status
- Confirms pulse animation on pending status
- Tests dot dimensions (h-2 w-2)

**Custom className Tests**
- Style merging and override capabilities
- Multiple class handling

**Props Validation Tests**
- All valid status types acceptance
- Optional className prop handling

**Accessibility Tests**
- Semantic structure validation
- Text readability and visibility
- Text contrast verification

**Edge Cases**
- Rapid status changes
- Status switching with style updates
- Dynamic className changes

**Integration Tests**
- Badge component integration
- Dot and text display together
- Inherited Badge base styles

### 3. WalletTable Component Tests (`src/components/wallet/__tests__/WalletTable.test.tsx`)

#### Test Categories

**Rendering Tests**
- Table structure validation
- Header rendering
- Wallet row rendering

**NetworkBadge Integration Tests**
- Network badge display for each wallet
- Correct styling application (mainnet/testnet)
- Multiple network handling

**StatusIndicator Integration Tests**
- Status indicator display
- Correct styling per status
- Multiple status handling

**Empty State Tests**
- Proper rendering with no wallets
- Header-only table structure

**Data Display Tests**
- Balance display and formatting
- Missing balance handling (dash display)
- Address truncation

**Responsive Design Tests**
- Column visibility at different breakpoints
- Responsive class application (sm:, md:, lg:)

**Edge Cases**
- Single wallet rendering
- Multiple wallets with same network
- Multiple wallets with same status
- Missing optional fields
- Minimal wallet data

**Accessibility Tests**
- Table semantic structure
- Proper row and cell structure
- Header and body organization

**Styling Tests**
- Container styles (rounded-xl, border, bg-white)
- Dark mode container styles
- Header row styles

## Running Tests

### Install Dependencies

```bash
pnpm install
```

### Run All Tests

```bash
pnpm test
```

### Run Tests in Watch Mode

```bash
pnpm test:watch
```

### Generate Coverage Report

```bash
pnpm test:coverage
```

## Test Configuration

### Jest Configuration (`jest.config.ts`)

- **Test Environment**: jsdom (for DOM testing)
- **Setup File**: jest.setup.ts (imports @testing-library/jest-dom)
- **Module Mapper**: Path alias support (@/* → src/*)
- **Coverage Collection**: Excludes app directory, .d.ts files, and story files

### Jest Setup (`jest.setup.ts`)

- Imports @testing-library/jest-dom for extended matchers
- Enables DOM testing utilities

## Component Enhancements

### NetworkBadge Component

**Added Features:**
- Graceful handling of invalid network values (defaults to mainnet)
- Comprehensive JSDoc documentation
- Input validation with fallback behavior

**Code:**
```typescript
// Validate network value and default to mainnet if invalid
const validNetwork: WalletNetwork = (
  Object.keys(networkStyles) as WalletNetwork[]
).includes(network)
  ? network
  : "mainnet";
```

### StatusIndicator Component

**Added Features:**
- Graceful handling of invalid status values (defaults to inactive)
- Comprehensive JSDoc documentation
- Input validation with fallback behavior

**Code:**
```typescript
// Validate status value and default to inactive if invalid
const validStatus: WalletStatus = (
  Object.keys(statusStyles) as WalletStatus[]
).includes(status)
  ? status
  : "inactive";
```

## Test Statistics

- **Total Test Suites**: 3
- **Total Test Cases**: 80+
- **Coverage Areas**:
  - Component rendering
  - Styling and theming
  - Props validation
  - Accessibility
  - Edge cases
  - Integration scenarios

## Acceptance Criteria Met

✅ **Behavior is covered by tests**
- 80+ test cases covering all component behaviors
- Unit tests for individual components
- Integration tests for component interactions
- Edge case handling tests

✅ **No regressions in related flows**
- WalletTable integration tests ensure NetworkBadge and StatusIndicator work correctly together
- Mock data tests validate component behavior with realistic data
- Responsive design tests ensure layout stability

✅ **Graceful handling of stale, disconnected, or invalid states**
- NetworkBadge validates network values and defaults to mainnet
- StatusIndicator validates status values and defaults to inactive
- WalletTable handles missing optional fields (balance, lastActivity)
- Empty state handling for zero wallets

✅ **Follows existing patterns**
- Uses Testing Library for React component testing
- Follows Jest conventions
- Matches project's TypeScript strict mode
- Integrates with existing Biome linting configuration

✅ **Documented where APIs change**
- JSDoc comments added to NetworkBadge and StatusIndicator
- TEST_DOCUMENTATION.md provides comprehensive test documentation
- Component enhancements documented with code examples

## CI/CD Integration

### Running Tests in CI

Add to your CI pipeline:

```bash
pnpm install
pnpm lint:fix
pnpm test --coverage
```

### Pre-commit Hook

Tests can be integrated with Husky pre-commit hooks:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged && pnpm test"
    }
  }
}
```

## Best Practices

1. **Run tests before committing**: `pnpm test`
2. **Check coverage**: `pnpm test:coverage`
3. **Watch mode for development**: `pnpm test:watch`
4. **Keep tests focused**: Each test validates one behavior
5. **Use descriptive test names**: Clearly state what is being tested
6. **Mock external dependencies**: useCopyToClipboard is mocked in WalletTable tests

## Future Enhancements

- Add visual regression tests with Percy or similar
- Add E2E tests with Playwright or Cypress
- Add performance benchmarks
- Add snapshot tests for component output
- Expand mock data scenarios

## Troubleshooting

### Tests Not Running

1. Ensure dependencies are installed: `pnpm install`
2. Clear Jest cache: `pnpm test --clearCache`
3. Check Node version compatibility (Node 18+)

### Import Errors

1. Verify path aliases in tsconfig.json
2. Check jest.config.ts moduleNameMapper configuration
3. Ensure all imports use @/* alias format

### Styling Tests Failing

1. Verify Tailwind CSS classes are correct
2. Check that class-variance-authority is properly installed
3. Ensure dark mode classes are properly formatted

## References

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Tailwind CSS](https://tailwindcss.com/)
- [Class Variance Authority](https://cva.style/)
