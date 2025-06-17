import { test, expect } from '@playwright/test';
import { LoginPage } from './pageObjects/LoginPage';
import { InventoryPage, SortOption } from './pageObjects/InventoryPage';
import { ProductDetailsPage } from './pageObjects/ProductDetailsPage';
import { STANDARD_USER, PRODUCTS } from './utils/testData';

test.describe('Product Catalog Tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let productDetailsPage: ProductDetailsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    productDetailsPage = new ProductDetailsPage(page);
    
    // Login before each test
    await loginPage.goto();
    await loginPage.login(STANDARD_USER.username, STANDARD_USER.password);
  });
  test('should display correct number of products', { tag: '@smoke' }, async () => {
    const productCount = await inventoryPage.getProductCount();
    expect(productCount).toBe(6);
  });
  test('should sort products by name A to Z', { tag: '@regression' }, async () => {
    await inventoryPage.sortProductsBy(SortOption.NameAZ);
    
    const productNames = await inventoryPage.getAllProductNames();
    const sortedNames = [...productNames].sort();
    
    expect(productNames).toEqual(sortedNames);
  });

  test('should sort products by name Z to A', { tag: '@regression' }, async () => {
    await inventoryPage.sortProductsBy(SortOption.NameZA);
    
    const productNames = await inventoryPage.getAllProductNames();
    const sortedNames = [...productNames].sort().reverse();
    
    expect(productNames).toEqual(sortedNames);
  });

  test('should sort products by price low to high', { tag: '@regression' }, async () => {
    await inventoryPage.sortProductsBy(SortOption.PriceLowHigh);
    
    const prices = await inventoryPage.getAllProductPrices();
    const sortedPrices = [...prices].sort((a, b) => a - b);
    
    expect(prices).toEqual(sortedPrices);
  });

  test('should sort products by price high to low', { tag: '@regression' }, async () => {
    await inventoryPage.sortProductsBy(SortOption.PriceHighLow);
    
    const prices = await inventoryPage.getAllProductPrices();
    const sortedPrices = [...prices].sort((a, b) => b - a);
    
    expect(prices).toEqual(sortedPrices);
  });
  test('should display product details page with correct information', { tag: '@smoke' }, async () => {
    const productName = PRODUCTS.BACKPACK;
    await inventoryPage.openProductDetails(productName);
    
    // Verify we're on the details page by checking product details container
    await expect(productDetailsPage.productDetailsContainer).toBeVisible();
    
    // Verify product details are correct
    const displayedName = await productDetailsPage.getProductName();
    expect(displayedName).toBe(productName);
    
    await expect(productDetailsPage.productDescription).toBeVisible();
    await expect(productDetailsPage.productPrice).toBeVisible();
    await expect(productDetailsPage.productImage).toBeVisible();
    
    // Verify we can return to products
    await productDetailsPage.backToProducts();
    
    // Verify we're back on the inventory page
    await expect(inventoryPage.productContainer).toBeVisible();
  });
    test('should verify all product details match between catalog and details page', { tag: '@smoke' }, async () => {
    // Get all products data from inventory page
    const productsData = await inventoryPage.getAllProductsData();
    
    // Loop through each product and verify details
    for (const product of productsData) {
      // Get catalog data
      const catalogDescription = await inventoryPage.getProductDescription(product.name);
      const catalogPrice = await inventoryPage.getProductPrice(product.name);
      
      // Open product details page
      await inventoryPage.openProductDetails(product.name);
      await expect(productDetailsPage.productDetailsContainer).toBeVisible();
      
      // Get details page data
      const detailsName = await productDetailsPage.getProductName();
      const detailsDescription = await productDetailsPage.getProductDescription();
      const detailsPrice = await productDetailsPage.getProductPrice();
      
      // Verify the data matches
      expect(detailsName).toBe(product.name);
      expect(detailsDescription).toBe(catalogDescription);
      expect(detailsPrice).toBe(catalogPrice);
      
      // Go back to products page
      await productDetailsPage.backToProducts();
      await expect(inventoryPage.productContainer).toBeVisible();
    }
  });
});
