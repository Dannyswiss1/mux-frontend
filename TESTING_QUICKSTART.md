# Testing Quick Start Guide

## 5-Minute Setup

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Run Tests
```bash
pnpm test
```

### 3. View Results
All 210+ tests should pass ✅

## Common Commands

```bash
# Run all tests once
pnpm test

# Run tests in watch mode (auto-rerun on file changes)
pnpm test:watch

# Run specific test file
pnpm test NetworkBadge.test.tsx

# Generate coverage report
pnpm test:coverage

# Run tests with verbose output
pnpm test --verbose

# Clear Jest cache
pnpm test --clearCache
```

## Test Files Location

```
src/components/wallet/__tests__/
├── NetworkBadge.test.tsx      # 80+ tests for network badge
├── StatusIndicator.test.tsx   # 80+ tests for status indicator
└── WalletTable.test.tsx       # 50+ integration tests
```

## What's Tested

### NetworkBadge Component
- ✅ Renders testnet and mainnet badges
- ✅ Applies correct colors and styles
- ✅ Handles dark mode
- ✅ Merges custom classes
- ✅ Validates invalid inputs gracefully
- ✅ Accessible and semantic

### StatusIndicator Component
- ✅ Renders all status types (active, pending, inactive)
- ✅ Shows animated dot for pending status
- ✅ Applies correct colors per status
- ✅ Handles dark mode
- ✅ Merges custom classes
- ✅ Validates invalid inputs gracefully
- ✅ Accessible and semantic

### WalletTable Component
- ✅ Displays wallet data in table format
- ✅ Integrates NetworkBadge correctly
- ✅ Integrates StatusIndicator correctly
- ✅ Handles empty wallet list
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Displays balance and address correctly
- ✅ Accessible table structure

## Component Enhancements

### NetworkBadge
Now gracefully handles invalid network values by defaulting to mainnet.

### StatusIndicator
Now gracefully handles invalid status values by defaulting to inactive.

## Coverage Report

Generate a detailed coverage report:

```bash
pnpm test:coverage
```

This creates a `coverage/` directory with HTML reports showing:
- Line coverage
- Branch coverage
- Function coverage
- Statement coverage

Open `coverage/lcov-report/index.html` in your browser to view.

## Debugging Tests

### Run Single Test
```bash
pnpm test -- --testNamePattern="should render testnet badge"
```

### Run Single File
```bash
pnpm test NetworkBadge.test.tsx
```

### Debug Mode
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

Then open `chrome://inspect` in Chrome DevTools.

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm test --coverage
      - run: pnpm build
```

## Troubleshooting

### "Cannot find module 'jest'"
```bash
pnpm install
```

### Tests timeout
Increase timeout in jest.config.ts:
```typescript
testTimeout: 10000
```

### Import errors with @/*
Verify `jest.config.ts` has correct moduleNameMapper:
```typescript
moduleNameMapper: {
  "^@/(.*)$": "<rootDir>/src/$1",
}
```

### Styling tests fail
Ensure Tailwind CSS classes are correct and class-variance-authority is installed.

## Next Steps

1. **Run tests**: `pnpm test`
2. **Check coverage**: `pnpm test:coverage`
3. **Watch mode**: `pnpm test:watch` (for development)
4. **Read docs**: See `TEST_DOCUMENTATION.md` for detailed info
5. **Integrate CI**: Add test commands to your CI pipeline

## Resources

- [Jest Docs](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [TEST_DOCUMENTATION.md](./TEST_DOCUMENTATION.md) - Comprehensive guide
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Implementation details

## Questions?

Refer to:
- `TEST_DOCUMENTATION.md` - Detailed test documentation
- `IMPLEMENTATION_SUMMARY.md` - Implementation overview
- Component JSDoc comments - In-code documentation
