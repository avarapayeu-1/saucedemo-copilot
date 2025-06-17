import { test, expect } from '@playwright/test';
import { LoginPage } from './pageObjects/LoginPage';
import { InventoryPage } from './pageObjects/InventoryPage';
import { CartPage } from './pageObjects/CartPage';
import { CheckoutStepOnePage } from './pageObjects/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from './pageObjects/CheckoutStepTwoPage';
import { FinishCheckoutPage } from './pageObjects/FinishCheckoutPage';
import { STANDARD_USER, PRODUCTS, CHECKOUT_INFO, MESSAGES } from './utils/testData';

test.describe('Complete E2E Checkout Flow', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutStepOnePage: CheckoutStepOnePage;
  let checkoutStepTwoPage: CheckoutStepTwoPage;
  let finishCheckoutPage: FinishCheckoutPage;
  
  test.beforeEach(async ({ page }) => {
    // Initialize page objects
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutStepOnePage = new CheckoutStepOnePage(page);
    checkoutStepTwoPage = new CheckoutStepTwoPage(page);
    finishCheckoutPage = new FinishCheckoutPage(page);
  });

  test('Complete checkout with multiple products', { tag: '@smoke' }, async () => {
    // Step 1: Login with standard user
    await loginPage.goto();
    await loginPage.login(STANDARD_USER.username, STANDARD_USER.password);
    
    // Verify successful login by checking we're on the inventory page
    await expect(inventoryPage.productContainer).toBeVisible();
    
    // Step 2: Add multiple items to the cart
    const productsToAdd = [
      PRODUCTS.BACKPACK,
      PRODUCTS.BIKE_LIGHT,
      PRODUCTS.BOLT_TSHIRT
    ];
    
    // Add each product to the cart
    for (const product of productsToAdd) {
      await inventoryPage.addProductToCart(product);
    }
    
    // Verify cart badge shows the correct number of items
    await expect(inventoryPage.cartBadge).toHaveText(productsToAdd.length.toString());
    
    // Step 3: Navigate to cart
    await inventoryPage.openCart();
    
    // Verify we're on the cart page
    await expect(cartPage.cartTitle).toBeVisible();
    
    // Verify all products are in the cart
    await expect(cartPage.cartItems).toHaveCount(productsToAdd.length);
    
    // Verify each product individually
    for (const product of productsToAdd) {
      const isProductInCart = await cartPage.isProductInCart(product);
      expect(isProductInCart).toBeTruthy();
    }
    
    // Step 4: Proceed to checkout
    await cartPage.checkout();
    
    // Verify we're on the checkout step one page
    await expect(checkoutStepOnePage.checkoutStepOneTitle).toBeVisible();
    
    // Step 5: Fill shipping information
    await checkoutStepOnePage.fillShippingInfo(
      CHECKOUT_INFO.firstName,
      CHECKOUT_INFO.lastName,
      CHECKOUT_INFO.postalCode
    );
    
    // Step 6: Continue to checkout step two
    await checkoutStepOnePage.continue();
    
    // Verify we're on the checkout overview page
    await expect(checkoutStepTwoPage.checkoutStepTwoTitle).toBeVisible();
    
    // Verify all the products are shown in the overview
    await expect(checkoutStepTwoPage.itemNames).toHaveCount(productsToAdd.length);
    
    // Step 7: Complete the order
    await checkoutStepTwoPage.finish();
    
    // Verify we're on the checkout complete page
    await expect(finishCheckoutPage.checkoutCompleteTitle).toBeVisible();
    
    // Verify the order confirmation message
    const confirmationMessage = await finishCheckoutPage.getOrderConfirmationMessage();
    expect(confirmationMessage).toContain(MESSAGES.ORDER_COMPLETE);
    
    // Step 8: Return to product page
    await finishCheckoutPage.backToProducts();
    
    // Verify we're back on the inventory page and cart is empty
    await expect(inventoryPage.productContainer).toBeVisible();
    await expect(inventoryPage.cartBadge).not.toBeVisible();
  });
});
