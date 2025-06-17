import { Locator, Page } from '@playwright/test';

export enum SortOption {
  NameAZ = 'az',
  NameZA = 'za',
  PriceLowHigh = 'lohi',
  PriceHighLow = 'hilo'
}

export class InventoryPage {
  readonly page: Page;
  readonly productContainer: Locator;
  readonly inventoryList: Locator;
  readonly cartButton: Locator;
  readonly menuButton: Locator;
  readonly sortDropdown: Locator;
  readonly cartBadge: Locator;
  readonly closeMenuButton: Locator;
  readonly logoutLink: Locator;
  readonly resetAppStateLink: Locator;
  readonly allItemsLink: Locator;
  readonly aboutLink: Locator;
  readonly productImages: Locator;
  readonly inventoryItems: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;
  readonly productDescriptions: Locator;
  constructor(page: Page) {
    this.page = page;
    this.productContainer = page.locator('.inventory_container');
    this.inventoryList = page.locator('.inventory_list');
    this.inventoryItems = page.locator('.inventory_item');
    this.cartButton = page.locator('.shopping_cart_link');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.closeMenuButton = page.locator('#react-burger-cross-btn');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.logoutLink = page.locator('#logout_sidebar_link');
    this.resetAppStateLink = page.locator('#reset_sidebar_link');
    this.allItemsLink = page.locator('#inventory_sidebar_link');
    this.aboutLink = page.locator('#about_sidebar_link');
    this.productImages = page.locator('.inventory_item_img');
    this.productNames = page.locator('.inventory_item_name');
    this.productPrices = page.locator('.inventory_item_price');
    this.productDescriptions = page.locator('.inventory_item_desc');
  }

  async goto() {
    await this.page.goto('/inventory.html');
  }
  async getProductCount() {
    return this.inventoryItems.count();
  }
  async addProductToCart(productName: string) {
    await this.inventoryItems
      .filter({ hasText: productName })
      .locator('button')
      .filter({ hasText: 'Add to cart' })
      .click();
  }
  async removeProductFromCart(productName: string) {
    await this.inventoryItems
      .filter({ hasText: productName })
      .locator('button')
      .filter({ hasText: 'Remove' })
      .click();
  }

  async openCart() {
    await this.cartButton.click();
  }  async openProductDetails(productName: string) {
    await this.productNames
      .filter({ hasText: productName })
      .click();
  }
  async sortProductsBy(option: SortOption) {
    // For select elements, we can directly use selectOption
    await this.sortDropdown.selectOption(option);
    // Sorting is performed client-side, no need to wait for network requests
  }
  async getAllProductNames(): Promise<string[]> {
    return this.productNames.allTextContents();
  }

  async getAllProductPrices(): Promise<number[]> {
    const priceTexts = await this.productPrices.allTextContents();
    return priceTexts.map(text => parseFloat(text.replace('$', '')));
  }

  async openMenu() {
    await this.menuButton.click();
  }
  async logout() {
    await this.openMenu();
    await this.logoutLink.click();
  }

  async getItemImages() {
    return this.productImages.all();
  }
  async getCartBadgeValue(): Promise<string | null> {
    const isVisible = await this.cartBadge.isVisible();
    return isVisible ? await this.cartBadge.textContent() : null;
  }

  async isProductListDisplayed() {
    return this.productContainer.isVisible();
  }
  async areAllProductImagesSame(): Promise<boolean> {
    const images = await this.productImages.all();
    
    if (images.length <= 1) return true;
    
    const firstImageSrc = await images[0].getAttribute('src');
    
    for (let i = 1; i < images.length; i++) {
      const src = await images[i].getAttribute('src');
      if (src !== firstImageSrc) {
        return false;
      }
    }
    
    return true;
  }

  async getProductDescription(productName: string): Promise<string | null> {
    const item = this.inventoryItems.filter({ hasText: productName });
    const desc = await item.locator('.inventory_item_desc').textContent();
    return desc;
  }

  async getProductPrice(productName: string): Promise<number> {
    const item = this.inventoryItems.filter({ hasText: productName });
    const priceText = await item.locator('.inventory_item_price').textContent();
    if (priceText) {
      return parseFloat(priceText.replace('$', ''));
    }
    return 0;
  }

  async getAllProductsData(): Promise<{ name: string; description: string; price: number }[]> {
    const names = await this.getAllProductNames();
    const result = [];
    
    for (const name of names) {
      const description = await this.getProductDescription(name) || '';
      const price = await this.getProductPrice(name);
      result.push({ name, description, price });
    }
    
    return result;
  }
}
