# CI/CD Verification & Testing Guide

## Overview

This document outlines how to verify the Testnet Hint feature implementation through CI/CD pipelines and local testing.

## Local Verification

### 1. Setup
```bash
cd mux-frontend
npm install
```

### 2. Linting
```bash
# Check for linting errors
npm run lint

# Auto-fix linting issues
npm run lint:fix
```

**Expected Output**:
- No errors in new files
- No warnings in modified files
- Biome formatting compliance

### 3. Type Checking
```bash
# TypeScript compilation check
npx tsc --noEmit
```

**Expected Output**:
- No type errors
- All types properly inferred
- Strict mode compliance

### 4. Unit Tests
```bash
# Run all tests
npm run test

# Run specific test file
npm run test -- friendbot.test.ts

# Run with coverage
npm run test -- --coverage

# Watch mode for development
npm run test -- --watch
```

**Expected Output**:
```
PASS  src/utils/__tests__/friendbot.test.ts
PASS  src/components/ui/__tests__/TestnetHint.test.tsx
PASS  src/components/wallet/__tests__/WalletTable.integration.test.tsx

Test Suites: 3 passed, 3 total
Tests:       50+ passed, 50+ total
```

### 5. Build Verification
```bash
# Build the project
npm run build

# Check build output
ls -la .next/
```

**Expected Output**:
- Build completes without errors
- No warnings about unused code
- All assets properly bundled

## CI/CD Pipeline Configuration

### GitHub Actions Example

```yaml
name: Testnet Hint Feature CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Type check
        run: npx tsc --noEmit
      
      - name: Run tests
        run: npm run test -- --coverage
      
      - name: Build
        run: npm run build
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

## Test Coverage Requirements

### Minimum Coverage Thresholds
- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 80%
- **Lines**: 80%

### Coverage Report
```bash
npm run test -- --coverage
```

**Expected Output**:
```
File                          | % Stmts | % Branch | % Funcs | % Lines
------------------------------|---------|----------|---------|--------
All files                     |   85.2  |   82.1   |   88.5  |   85.2
 src/utils/friendbot.ts       |   100   |   100    |   100   |   100
 src/components/ui/TestnetHint.tsx | 92  |   88     |   95    |   92
 src/components/wallet/WalletTable.tsx | 78 | 75    |   80    |   78
```

## Pre-commit Hooks

### Husky Configuration
The project uses Husky with lint-staged for pre-commit checks:

```bash
# Automatically runs on git commit
npm run prepare
```

**Checks**:
- Biome formatting
- ESLint validation
- Type checking
- Test execution (optional)

## Manual Testing Checklist

### Visual Testing
- [ ] Testnet hint displays on testnet wallets page
- [ ] Testnet hint does NOT display on mainnet wallets page
- [ ] Testnet hint does NOT display on empty wallets page
- [ ] Dismiss button works correctly
- [ ] Friendbot link opens in new tab
- [ ] Learn More link opens in new tab
- [ ] Compact variant displays correctly
- [ ] Dark mode styling looks correct

### Functional Testing
- [ ] Hint appears when testnet wallets are present
- [ ] Hint disappears when dismissed
- [ ] Hint reappears on page reload
- [ ] Hint updates when wallets change
- [ ] Links have correct URLs
- [ ] Links have security attributes

### Accessibility Testing
- [ ] Keyboard navigation works
- [ ] Tab order is correct
- [ ] ARIA labels are present
- [ ] Color contrast is sufficient
- [ ] Screen reader announces content correctly

### Browser Testing
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari
- [ ] Chrome Mobile

### Performance Testing
```bash
# Lighthouse audit
npm run build
npx lighthouse http://localhost:3000/demo/dashboard/wallets
```

**Expected Metrics**:
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 90

## Regression Testing

### Existing Features
- [ ] WalletTable still renders correctly
- [ ] Address truncation works
- [ ] Copy to clipboard works
- [ ] Explorer links work
- [ ] Network badges display correctly
- [ ] Status indicators display correctly
- [ ] Responsive design works
- [ ] Dark mode works

### Related Features
- [ ] ExplorerLink component works
- [ ] NetworkBadge component works
- [ ] StatusIndicator component works
- [ ] useCopyToClipboard hook works

## Performance Benchmarks

### Bundle Size
```bash
npm run build
# Check .next/static/chunks/ for bundle sizes
```

**Expected**:
- TestnetHint component: < 5KB gzipped
- friendbot utilities: < 1KB gzipped
- Total impact: < 6KB gzipped

### Runtime Performance
```bash
# React DevTools Profiler
# Check component render times
```

**Expected**:
- TestnetHint render: < 1ms
- WalletTable render: < 5ms
- useMemo recalculation: < 1ms

## Security Verification

### OWASP Top 10 Checks
- [ ] No XSS vulnerabilities (URL encoding verified)
- [ ] No injection attacks (input validation verified)
- [ ] No sensitive data exposure (no secrets in code)
- [ ] No broken authentication (N/A for this feature)
- [ ] No broken access control (N/A for this feature)

### Dependency Audit
```bash
npm audit
```

**Expected**:
- No critical vulnerabilities
- No high vulnerabilities
- All dependencies up to date

## Accessibility Verification

### WCAG 2.1 AA Compliance
```bash
# Run accessibility audit
npx axe-core http://localhost:3000/demo/dashboard/wallets
```

**Expected**:
- No violations
- No warnings
- All best practices followed

### Screen Reader Testing
- [ ] NVDA (Windows)
- [ ] JAWS (Windows)
- [ ] VoiceOver (macOS/iOS)
- [ ] TalkBack (Android)

## Documentation Verification

### Completeness Check
- [ ] Feature documentation complete
- [ ] Implementation guide complete
- [ ] Code comments present
- [ ] JSDoc comments present
- [ ] Usage examples provided
- [ ] API documentation complete

### Accuracy Check
- [ ] Documentation matches implementation
- [ ] Examples are correct
- [ ] Links are valid
- [ ] Code snippets are accurate

## Deployment Verification

### Staging Environment
```bash
# Deploy to staging
npm run build
# Deploy .next/ to staging server

# Verify on staging
curl https://staging.mux.example.com/demo/dashboard/wallets
```

**Checks**:
- [ ] Feature loads without errors
- [ ] No console errors
- [ ] No network errors
- [ ] Performance acceptable
- [ ] All links work

### Production Environment
```bash
# Deploy to production
npm run build
# Deploy .next/ to production server

# Verify on production
curl https://mux.example.com/demo/dashboard/wallets
```

**Checks**:
- [ ] Feature loads without errors
- [ ] No console errors
- [ ] No network errors
- [ ] Performance acceptable
- [ ] All links work
- [ ] Analytics tracking works

## Monitoring & Alerts

### Error Tracking
- Monitor Sentry for errors
- Alert on new errors
- Track error frequency

### Performance Monitoring
- Monitor Core Web Vitals
- Alert on performance degradation
- Track user experience metrics

### User Analytics
- Track hint dismissals
- Track Friendbot link clicks
- Track feature usage

## Rollback Plan

### If Issues Detected
1. Revert commit
2. Investigate root cause
3. Fix in new branch
4. Re-test thoroughly
5. Re-deploy

### Rollback Command
```bash
git revert <commit-hash>
git push origin main
```

## Sign-off Checklist

- [ ] All tests passing
- [ ] No linting errors
- [ ] No type errors
- [ ] Code review approved
- [ ] Documentation complete
- [ ] Manual testing complete
- [ ] Accessibility verified
- [ ] Security verified
- [ ] Performance acceptable
- [ ] No regressions detected
- [ ] Ready for production

## Continuous Monitoring

### Post-Deployment
- Monitor error rates
- Monitor performance metrics
- Monitor user engagement
- Monitor accessibility issues
- Collect user feedback

### Maintenance
- Keep dependencies updated
- Monitor for security issues
- Optimize performance
- Improve documentation
- Gather user feedback

## Support & Escalation

### Issues Found
1. Document issue with reproduction steps
2. Create GitHub issue
3. Assign to team member
4. Track resolution
5. Update documentation

### Contact
- Feature Owner: [Name]
- Code Reviewer: [Name]
- QA Lead: [Name]
- DevOps: [Name]

## References

- [Jest Testing Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Biome Linter](https://biomejs.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
