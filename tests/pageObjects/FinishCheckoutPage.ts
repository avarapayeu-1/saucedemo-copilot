import { Locator, Page } from '@playwright/test';

export class FinishCheckoutPage {
  readonly page: Page;
  readonly completeHeader: Locator;
  readonly backHomeButton: Locator;
  readonly checkoutCompleteTitle: Locator;
  readonly completePonyImage: Locator;
  readonly completeText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.completeHeader = page.locator('.complete-header');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
    this.checkoutCompleteTitle = page.locator('.title').filter({ hasText: 'Checkout: Complete!' });
    this.completePonyImage = page.locator('.pony_express');
    this.completeText = page.locator('.complete-text');
  }

  async getOrderConfirmationMessage() {
    return this.completeHeader.textContent();
  }

  async backToProducts() {
    await this.backHomeButton.click();
  }
}
