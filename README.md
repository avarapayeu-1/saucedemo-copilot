# Sauce Demo Copilot

A test automation framework for the SauceDemo website (https://www.saucedemo.com) built using Playwright with TypeScript.

## About

This project was initialized on June 17, 2025 as a demonstration of GitHub repository creation and automation. It provides a structured test automation framework for testing the SauceDemo web application.

## Framework Structure

```
saucedemo-copilot/
├── tests/                         # Test directory
│   ├── pageObjects/               # Page Object Models
│   │   ├── LoginPage.ts           # Login page interactions
│   │   ├── InventoryPage.ts       # Product listing page interactions
│   │   ├── ProductDetailsPage.ts  # Product details page interactions
│   │   ├── CartPage.ts            # Shopping cart page interactions
│   │   └── CheckoutPage.ts        # Checkout flow page interactions
│   ├── utils/                     # Utility functions and test data
│   │   └── testData.ts            # Test data constants and interfaces
│   ├── auth-tests.spec.ts         # Authentication tests
│   ├── catalog-tests.spec.ts      # Product catalog tests
│   ├── cart-tests.spec.ts         # Shopping cart tests
│   ├── checkout-tests.spec.ts     # Checkout process tests
│   └── special-users-tests.spec.ts # Special user account tests
├── playwright.config.ts           # Playwright configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # NPM package configuration
├── test-scenarios.md              # Detailed test scenarios documentation
└── README.md                      # Project documentation
```

## Features

- TypeScript-based test automation framework
- Page Object Model design pattern
- Playwright for cross-browser testing
- Fixtures for test setup and teardown
- HTML reporting
- Screenshots on test failure
- Parallel test execution

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Install Playwright browsers:
   ```
   npx playwright install
   ```

### Running Tests

Run all tests:
```
npm test
```

Run tests in UI mode:
```
npm run test:ui
```

Run tests with browsers visible:
```
npm run test:headed
```

Run tests in a specific browser:
```
npm run test:chrome
npm run test:firefox
npm run test:safari
```

### Test Suites

The tests are organized into two main suites:

#### Smoke Tests

Smoke tests cover the critical functionality and happy paths. Run only smoke tests:
```
npm run test:smoke
```

Run smoke tests in Chrome only:
```
npm run test:smoke:chrome
```

#### Regression Tests

Regression tests cover edge cases, validation scenarios, and non-critical features. Run only regression tests:
```
npm run test:regression
```

Run regression tests in Chrome only:
```
npm run test:regression:chrome
```

### Test Reports

View the HTML test report:
```
npm run test:report
```

## Continuous Integration

The project includes GitHub Actions workflows for automated test execution:

### Daily Test Execution

- Smoke tests run automatically every day at 9 AM UTC
- If smoke tests pass, regression tests will run automatically afterward
- Test results are saved as artifacts for 30 days

### Pull Request Checks

- Smoke tests run automatically on every pull request to main/master branches
- Test results are saved as artifacts for 7 days

## License

ISC
