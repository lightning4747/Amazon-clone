# Testing Guide

The project uses [Jasmine](https://jasmine.github.io/) for unit testing.

## Test Structure

Tests are located in the `tests/` directory and are organized by module:

- `tests/data/`: Unit tests for data management (Cart, Auth, Orders).
- `tests/checkout/`: Integration tests for the checkout process.
- `tests/utils/`: Tests for utility functions (e.g., currency formatting).

## Running Tests

To run the full suite of unit tests:
1. Open `tests/tests.html` in your web browser.
2. Jasmine will automatically discover and run all included test specs.

## Writing New Tests

Each test suite should be a JavaScript module and included in `tests/tests.html`.

### Automated Testing Principles
- **Isolation**: Use `spyOn` to mock global objects like `localStorage` or `fetch`.
- **Cleanliness**: Use `beforeEach` and `afterEach` to reset the DOM and storage states.
- **Coverage**: Ensure tests cover both success and failure (error) scenarios.

### Example Test Case (Auth)
```js
describe('login', () => {
  it('logs in successfully with correct credentials', () => {
    const result = login('john@test.com', 'password123');
    expect(result.success).toBe(true);
    expect(result.user.email).toBe('john@test.com');
  });
});
```
