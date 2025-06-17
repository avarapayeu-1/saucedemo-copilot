import { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartList: Locator;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly cartTitle: Locator;
  readonly itemQuantities: Locator;
  readonly itemNames: Locator;
  readonly removeButtons: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartList = page.locator('.cart_list');
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.cartTitle = page.locator('.title').filter({ hasText: 'Your Cart' });
    this.itemQuantities = page.locator('.cart_quantity');
    this.itemNames = page.locator('.inventory_item_name');
    this.removeButtons = page.locator('[data-test^="remove"]');
  }

  async goto() {
    await this.page.goto('/cart.html');
  }

  async checkout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async getCartItemCount() {
    return this.cartItems.count();
  }

  async getProductQuantity(productName: string) {
    const item = this.cartItems.filter({ hasText: productName });
    const quantityText = await item.locator('.cart_quantity').textContent();
    return quantityText ? parseInt(quantityText.trim()) : 0;
  }
  async removeProduct(productName: string) {
    // Find the cart item containing our product and click its remove button
    await this.cartItems
      .filter({ hasText: productName })
      .locator(this.removeButtons)
      .click();
  }

  async isProductInCart(productName: string) {
    const count = await this.cartItems
      .filter({ hasText: productName })
      .count();
    return count > 0;
  }
}
