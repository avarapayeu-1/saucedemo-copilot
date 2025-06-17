import { test, expect } from '@playwright/test';
import { LoginPage } from './pageObjects/LoginPage';
import { InventoryPage } from './pageObjects/InventoryPage';
import { CartPage } from './pageObjects/CartPage';
import { STANDARD_USER, PRODUCTS } from './utils/testData';

test.describe('Shopping Cart Tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    
    // Login before each test
    await loginPage.goto();
    await loginPage.login(STANDARD_USER.username, STANDARD_USER.password);
  });
  test('should add product to cart', { tag: '@smoke' }, async () => {
    // Add product to cart
    await inventoryPage.addProductToCart(PRODUCTS.BACKPACK);
    
    // Verify cart badge shows 1 item
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('should remove product from cart on inventory page', { tag: '@smoke' }, async () => {
    // Add product then remove it
    await inventoryPage.addProductToCart(PRODUCTS.BACKPACK);
    await inventoryPage.removeProductFromCart(PRODUCTS.BACKPACK);
    
    // Verify cart badge is gone
    await expect(inventoryPage.cartBadge).not.toBeVisible();
  });
  test('should navigate to cart and show correct items', { tag: '@smoke' }, async () => {
    // Add product to cart
    await inventoryPage.addProductToCart(PRODUCTS.BACKPACK);
    
    // Go to cart
    await inventoryPage.openCart();
    
    // Verify we're on the cart page
    await expect(cartPage.cartTitle).toBeVisible();
    
    // Verify correct item is in cart
    await expect(cartPage.cartItems).toHaveCount(1);
    expect(await cartPage.isProductInCart(PRODUCTS.BACKPACK)).toBeTruthy();
    expect(await cartPage.getProductQuantity(PRODUCTS.BACKPACK)).toBe(1);
  });
  test('should remove product from cart page', { tag: '@smoke' }, async () => {
    // Add product to cart
    await inventoryPage.addProductToCart(PRODUCTS.BACKPACK);
    
    // Go to cart
    await inventoryPage.openCart();
    
    // Remove item
    await cartPage.removeProduct(PRODUCTS.BACKPACK);
    
    // Verify cart is empty
    await expect(cartPage.cartItems).not.toBeVisible();
  });
  test('should add multiple products to cart', { tag: '@smoke' }, async () => {
    // Add multiple products
    await inventoryPage.addProductToCart(PRODUCTS.BACKPACK);
    await inventoryPage.addProductToCart(PRODUCTS.BIKE_LIGHT);
    await inventoryPage.addProductToCart(PRODUCTS.BOLT_TSHIRT);
    
    // Verify cart badge shows 3 items
    await expect(inventoryPage.cartBadge).toHaveText('3');
    
    // Verify all items are in cart
    await inventoryPage.openCart();
    await expect(cartPage.cartItems).toHaveCount(3);
    expect(await cartPage.isProductInCart(PRODUCTS.BACKPACK)).toBeTruthy();
    expect(await cartPage.isProductInCart(PRODUCTS.BIKE_LIGHT)).toBeTruthy();
    expect(await cartPage.isProductInCart(PRODUCTS.BOLT_TSHIRT)).toBeTruthy();
  });

  test('should continue shopping from cart page', { tag: '@smoke' }, async () => {
    // Add product and go to cart
    await inventoryPage.addProductToCart(PRODUCTS.BACKPACK);
    await inventoryPage.openCart();
    
    // Continue shopping
    await cartPage.continueShopping();
    
    // Verify we're back at inventory page
    await expect(inventoryPage.productContainer).toBeVisible();
  });
});
