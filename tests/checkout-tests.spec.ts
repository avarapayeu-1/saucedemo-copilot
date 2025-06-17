import { test, expect } from '@playwright/test';
import { LoginPage } from './pageObjects/LoginPage';
import { InventoryPage } from './pageObjects/InventoryPage';
import { CartPage } from './pageObjects/CartPage';
import { CheckoutStepOnePage } from './pageObjects/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from './pageObjects/CheckoutStepTwoPage';
import { FinishCheckoutPage } from './pageObjects/FinishCheckoutPage';
import { STANDARD_USER, PRODUCTS, CHECKOUT_INFO, ERROR_MESSAGES, MESSAGES } from './utils/testData';

test.describe('Checkout Process Tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutStepOnePage: CheckoutStepOnePage;
  let checkoutStepTwoPage: CheckoutStepTwoPage;
  let finishCheckoutPage: FinishCheckoutPage;  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutStepOnePage = new CheckoutStepOnePage(page);
    checkoutStepTwoPage = new CheckoutStepTwoPage(page);
    finishCheckoutPage = new FinishCheckoutPage(page);
    
    // Login, add item to cart, and navigate to cart
    await loginPage.goto();
    await loginPage.login(STANDARD_USER.username, STANDARD_USER.password);
    await inventoryPage.addProductToCart(PRODUCTS.BACKPACK);
    await inventoryPage.openCart();
  });
  
  test('should require customer information during checkout', { tag: '@regression' }, async () => {
    // Start checkout
    await cartPage.checkout();
    
    // Verify we're on the checkout step one page
    await expect(checkoutStepOnePage.checkoutStepOneTitle).toBeVisible();
    
    // Try to continue without info
    await checkoutStepOnePage.continue();
    
    // Verify we get an error
    const errorMessage = await checkoutStepOnePage.getErrorMessage();
    expect(errorMessage).toBe(ERROR_MESSAGES.REQUIRED_FIRSTNAME);
  });

  test('should validate last name field', { tag: '@regression' }, async () => {
    // Start checkout
    await cartPage.checkout();
    
    // Fill only first name
    await checkoutStepOnePage.fillShippingInfo(CHECKOUT_INFO.firstName, '', '');
    await checkoutStepOnePage.continue();
    
    // Verify error
    const errorMessage = await checkoutStepOnePage.getErrorMessage();
    expect(errorMessage).toBe(ERROR_MESSAGES.REQUIRED_LASTNAME);
  });

  test('should validate postal code field', { tag: '@regression' }, async () => {
    // Start checkout
    await cartPage.checkout();
    
    // Fill only first and last name
    await checkoutStepOnePage.fillShippingInfo(
      CHECKOUT_INFO.firstName, 
      CHECKOUT_INFO.lastName, 
      ''
    );
    await checkoutStepOnePage.continue();
    
    // Verify error
    const errorMessage = await checkoutStepOnePage.getErrorMessage();
    expect(errorMessage).toBe(ERROR_MESSAGES.REQUIRED_POSTALCODE);
  });
  
  test('should complete checkout with valid information', { tag: '@smoke' }, async () => {
    // Start checkout
    await cartPage.checkout();
    
    // Fill out form with valid information
    await checkoutStepOnePage.fillShippingInfo(
      CHECKOUT_INFO.firstName,
      CHECKOUT_INFO.lastName,
      CHECKOUT_INFO.postalCode
    );
    await checkoutStepOnePage.continue();
    
    // Verify we're on checkout step two
    await expect(checkoutStepTwoPage.checkoutStepTwoTitle).toBeVisible();
    
    // Verify item details and summary
    await expect(checkoutStepTwoPage.itemNames).toHaveText(PRODUCTS.BACKPACK);
    await expect(checkoutStepTwoPage.summaryInfo).toBeVisible();
    
    // Verify total is greater than zero
    const total = await checkoutStepTwoPage.getTotalAmount();
    expect(total).toBeGreaterThan(0);
    
    // Complete order
    await checkoutStepTwoPage.finish();
    
    // Verify order completed
    await expect(finishCheckoutPage.checkoutCompleteTitle).toBeVisible();
    const confirmationMessage = await finishCheckoutPage.getOrderConfirmationMessage();
    expect(confirmationMessage).toBe(MESSAGES.ORDER_COMPLETE);
  });  test('should allow navigation back to products from checkout complete', { tag: '@smoke' }, async () => {
    // Complete checkout process
    await cartPage.checkout();
    await checkoutStepOnePage.fillShippingInfo(
      CHECKOUT_INFO.firstName,
      CHECKOUT_INFO.lastName,
      CHECKOUT_INFO.postalCode
    );
    await checkoutStepOnePage.continue();
    await checkoutStepTwoPage.finish();
    
    // Verify we're on complete page
    await expect(finishCheckoutPage.checkoutCompleteTitle).toBeVisible();
    
    // Go back home
    await finishCheckoutPage.backToProducts();
    
    // Verify we're back at products page
    await expect(inventoryPage.productContainer).toBeVisible();
  });

  test('should allow canceling checkout at step one', { tag: '@regression' }, async () => {
    // Start checkout
    await cartPage.checkout();
    
    // Cancel checkout
    await checkoutStepOnePage.cancel();
    
    // Verify we're back at cart page
    await expect(cartPage.cartTitle).toBeVisible();
  });

  test('should allow canceling checkout at step two', { tag: '@regression' }, async () => {
    // Start checkout
    await cartPage.checkout();
    
    // Fill out form with valid information
    await checkoutStepOnePage.fillShippingInfo(
      CHECKOUT_INFO.firstName,
      CHECKOUT_INFO.lastName,
      CHECKOUT_INFO.postalCode
    );
    await checkoutStepOnePage.continue();
    
    // Cancel checkout
    await checkoutStepTwoPage.cancel();
    
    // Verify we're back at products page (different from step one cancel)
    await expect(inventoryPage.productContainer).toBeVisible();
  });
});
