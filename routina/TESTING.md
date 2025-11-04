# Testing Guide for Routina

## Overview
Comprehensive testing strategy for production-ready application.

## Test Coverage

### Unit Tests (Vitest)
Location: `__tests__/`

#### Running Unit Tests
```bash
# Run all unit tests
pnpm test

# Run with UI
pnpm test:ui

# Run with coverage
pnpm test:coverage
```

#### Test Files
1. **utils.test.ts** - Utility function tests
   - Time formatting
   - Date handling
   - Class name merging
   - Time conversions

2. **components.test.tsx** - UI component tests
   - Button interactions
   - Input validation
   - Card rendering
   - Accessibility features

3. **api.test.ts** - API logic tests
   - Request/response structures
   - Data validation
   - Error handling

### E2E Tests (Playwright)
Location: `e2e/`

#### Running E2E Tests
```bash
# Run all E2E tests
pnpm test:e2e

# Run with UI mode
pnpm test:e2e:ui

# View test report
pnpm test:e2e:report
```

#### Test Suites
1. **auth.spec.ts** - Authentication flows
   - Sign in/sign up forms
   - Form validation
   - Navigation
   - Accessibility
   - Responsive design

#### Browser Coverage
- Chrome/Chromium
- Firefox
- Safari/WebKit
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

### Run All Tests
```bash
pnpm test:all
```

## Test Standards

### Unit Test Requirements
- ✅ All utility functions tested
- ✅ Component rendering verified
- ✅ User interactions covered
- ✅ Error states handled
- ✅ Accessibility features tested

### E2E Test Requirements
- ✅ Critical user flows tested
- ✅ Multi-browser coverage
- ✅ Mobile responsiveness verified
- ✅ Keyboard navigation tested
- ✅ ARIA labels validated

### Accessibility Testing
- ✅ WCAG 2.2 AA compliance
- ✅ Keyboard navigation
- ✅ Screen reader compatibility
- ✅ Focus management
- ✅ Color contrast ratios
- ✅ Semantic HTML

### Performance Testing
- ✅ Lighthouse scores ≥90
- ✅ Core Web Vitals optimized
- ✅ Image optimization
- ✅ Code splitting
- ✅ Lazy loading

## Continuous Integration

### Pre-commit Checks
```bash
pnpm lint
pnpm test
```

### Pre-deployment Checks
```bash
pnpm test:all
pnpm build
```

## Test Maintenance

### Adding New Tests
1. Create test file in appropriate directory
2. Follow existing patterns
3. Include accessibility checks
4. Update this documentation

### Best Practices
- Test user behavior, not implementation
- Use semantic queries (getByRole, getByLabelText)
- Test accessibility in every component
- Include happy path and error scenarios
- Keep tests fast and focused

## Coverage Goals
- Unit Tests: ≥80% coverage
- E2E Tests: All critical paths
- Accessibility: 100% WCAG AA compliance

## Troubleshooting

### Unit Tests Failing
- Check import paths
- Verify mock data
- Review test setup

### E2E Tests Timing Out
- Increase timeout in playwright.config.ts
- Check network conditions
- Verify dev server is running

### Accessibility Issues
- Run axe-core audit
- Check ARIA labels
- Verify keyboard navigation
- Test with screen reader

## Resources
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
