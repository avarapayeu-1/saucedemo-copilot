import { Locator, Page } from '@playwright/test';

export class ProductDetailsPage {
  readonly page: Page;
  readonly productName: Locator;
  readonly productDescription: Locator;
  readonly productPrice: Locator;
  readonly addToCartButton: Locator;
  readonly removeButton: Locator;
  readonly backButton: Locator;
  readonly productImage: Locator;
  readonly productDetailsContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productName = page.locator('.inventory_details_name');
    this.productDescription = page.locator('.inventory_details_desc');
    this.productPrice = page.locator('.inventory_details_price');
    this.addToCartButton = page.locator('[data-test^="add-to-cart"]');
    this.removeButton = page.locator('[data-test^="remove"]');
    this.backButton = page.locator('[data-test="back-to-products"]');
    this.productImage = page.locator('.inventory_details_img');
    this.productDetailsContainer = page.locator('.inventory_details_container');
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async removeFromCart() {
    await this.removeButton.click();
  }

  async backToProducts() {
    await this.backButton.click();
  }

  async getProductName() {
    return this.productName.textContent();
  }
  async getProductPrice() {
    const priceText = await this.productPrice.textContent();
    if (priceText) {
      return parseFloat(priceText.replace('$', ''));
    }
    return 0;
  }

  async getProductDescription() {
    return this.productDescription.textContent();
  }
}
