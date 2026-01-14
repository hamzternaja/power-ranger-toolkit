---
name: testing
description: Write and run tests including unit tests, integration tests, and E2E tests. Use when ensuring code quality, writing test cases, or setting up testing frameworks.
---

# 🧪 Testing Skill

## Test Types

| Type | Purpose | Tools |
|------|---------|-------|
| Unit | Test functions in isolation | Jest, Vitest, pytest |
| Integration | Test modules together | Supertest, pytest |
| E2E | Test full user flows | Playwright, Cypress |

---

## Unit Test Patterns

### JavaScript/TypeScript (Jest/Vitest)
```javascript
describe('calculateTotal', () => {
  it('should add tax correctly', () => {
    expect(calculateTotal(100, 0.07)).toBe(107);
  });

  it('should handle zero price', () => {
    expect(calculateTotal(0, 0.07)).toBe(0);
  });

  it('should throw on negative price', () => {
    expect(() => calculateTotal(-10, 0.07)).toThrow();
  });
});
```

### Python (pytest)
```python
def test_calculate_total():
    assert calculate_total(100, 0.07) == 107

def test_calculate_total_zero():
    assert calculate_total(0, 0.07) == 0

def test_calculate_total_negative():
    with pytest.raises(ValueError):
        calculate_total(-10, 0.07)
```

---

## Test Structure (AAA Pattern)

```javascript
test('should upload file successfully', async () => {
  // Arrange
  const file = createMockFile('video.mp4');
  const uploader = new Uploader();

  // Act
  const result = await uploader.upload(file);

  // Assert
  expect(result.success).toBe(true);
  expect(result.url).toContain('uploaded');
});
```

---

## Mocking

```javascript
// Mock function
const mockFetch = jest.fn().mockResolvedValue({ ok: true });

// Mock module
jest.mock('./api', () => ({
  fetchData: jest.fn().mockResolvedValue({ data: [] })
}));

// Mock timer
jest.useFakeTimers();
jest.advanceTimersByTime(3000);
```

---

## E2E Testing (Playwright)

```javascript
test('upload flow', async ({ page }) => {
  await page.goto('https://tiktok.com/upload');
  
  // Upload file
  await page.setInputFiles('input[type="file"]', 'video.mp4');
  
  // Fill form
  await page.fill('[placeholder="Title"]', 'My Video');
  
  // Submit
  await page.click('button:has-text("Post")');
  
  // Verify
  await expect(page.locator('.success')).toBeVisible();
});
```

---

## Test Checklist

- [ ] Happy path covered
- [ ] Edge cases (null, empty, boundary)
- [ ] Error cases
- [ ] Async behavior
- [ ] Mocks cleaned up

---

## 🤖 AI Test Generation

### Auto-Generate Test Cases
```javascript
// Given a function like:
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// AI generates these test cases:
describe('validateEmail', () => {
  // Happy path
  test('valid email returns true', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });
  
  // Edge cases
  test.each([
    ['', false],                    // empty
    ['user', false],                // no @
    ['user@', false],               // no domain
    ['@example.com', false],        // no user
    ['user@example', false],        // no TLD
    ['user.name@example.co.th', true], // multiple dots
  ])('validateEmail(%s) = %s', (input, expected) => {
    expect(validateEmail(input)).toBe(expected);
  });
});
```

---

## 📊 Coverage Analysis

### Commands
```bash
# Jest coverage
npm test -- --coverage

# Vitest coverage
npx vitest --coverage

# NYC coverage
npx nyc npm test
```

### Coverage Targets
| Metric | Minimum | Good |
|--------|---------|------|
| Statements | 70% | 90%+ |
| Branches | 70% | 85%+ |
| Functions | 70% | 90%+ |
| Lines | 70% | 90%+ |

---

## 📸 Snapshot Testing

```javascript
// Generate snapshot
test('component renders correctly', () => {
  const tree = render(<Button label="Click me" />);
  expect(tree).toMatchSnapshot();
});

// Update snapshots
// npm test -- -u
```

---

## Test Commands

```bash
# Run all tests
npm test

# Run specific file
npm test -- button.test.js

# Watch mode
npm test -- --watch

# Update snapshots
npm test -- -u

# Coverage report
npm test -- --coverage --coverageReporters=text
```
