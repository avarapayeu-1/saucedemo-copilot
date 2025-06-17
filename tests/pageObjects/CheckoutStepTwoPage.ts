import { Locator, Page } from '@playwright/test';

export class CheckoutStepTwoPage {
  readonly page: Page;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;
  readonly summaryInfo: Locator;
  readonly summaryTotal: Locator;
  readonly checkoutStepTwoTitle: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;

  constructor(page: Page) {
    this.page = page;
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.summaryInfo = page.locator('.summary_info');
    this.summaryTotal = page.locator('.summary_total_label');
    this.checkoutStepTwoTitle = page.locator('.title').filter({ hasText: 'Checkout: Overview' });
    this.itemNames = page.locator('.inventory_item_name');
    this.itemPrices = page.locator('.inventory_item_price');
  }

  async finish() {
    await this.finishButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async getTotalAmount() {
    const totalText = await this.summaryTotal.textContent();
    if (totalText) {
      const match = totalText.match(/\$(\d+\.\d+)/);
      if (match && match[1]) {
        return parseFloat(match[1]);
      }
    }
    return 0;
  }
}
