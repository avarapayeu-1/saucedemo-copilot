import { test, expect } from '@playwright/test';
import { LoginPage } from './pageObjects/LoginPage';
import { InventoryPage } from './pageObjects/InventoryPage';
import { STANDARD_USER, LOCKED_OUT_USER, ERROR_MESSAGES } from './utils/testData';

test.describe('Authentication Tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.goto();
  });

  test('should login with valid credentials', { tag: '@smoke' }, async () => {
    await loginPage.login(STANDARD_USER.username, STANDARD_USER.password);
    
    // Verify successful login by checking that we're on the inventory page
    await expect(inventoryPage.productContainer).toBeVisible();
  });

  test('should display error for locked out user', { tag: '@regression' }, async () => {
    await loginPage.login(LOCKED_OUT_USER.username, LOCKED_OUT_USER.password);
    
    // Verify correct error message
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBe(ERROR_MESSAGES.LOCKED_OUT);
  });

  test('should display error with invalid credentials', { tag: '@regression' }, async () => {
    await loginPage.login('invalid_user', 'invalid_password');
    
    // Verify correct error message
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBe(ERROR_MESSAGES.INVALID_CREDENTIALS);
  });

  test('should validate empty username field', { tag: '@regression' }, async () => {
    await loginPage.login('', STANDARD_USER.password);
    
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBe(ERROR_MESSAGES.REQUIRED_USERNAME);
  });

  test('should validate empty password field', { tag: '@regression' }, async () => {
    await loginPage.login(STANDARD_USER.username, '');
    
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBe(ERROR_MESSAGES.REQUIRED_PASSWORD);
  });  test('should logout successfully', { tag: '@smoke' }, async ({ page }) => {
    // Login first
    await loginPage.login(STANDARD_USER.username, STANDARD_USER.password);
    
    // Verify we're logged in
    await expect(inventoryPage.productContainer).toBeVisible();
    
    // Logout
    await inventoryPage.logout();
    
    // Verify we're back at the login page
    await expect(loginPage.loginButton).toBeVisible();
    
    // Verify we can't access inventory page after logout by trying to navigate there
    await page.goto('/inventory.html');
    
    // We should be redirected back to login page
    await expect(loginPage.loginButton).toBeVisible();
  });
});
