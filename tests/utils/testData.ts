export interface UserCredentials {
  username: string;
  password: string;
}

// Test user credentials
export const STANDARD_USER: UserCredentials = {
  username: 'standard_user',
  password: 'secret_sauce'
};

export const LOCKED_OUT_USER: UserCredentials = {
  username: 'locked_out_user',
  password: 'secret_sauce'
};

export const PROBLEM_USER: UserCredentials = {
  username: 'problem_user',
  password: 'secret_sauce'
};

export const PERFORMANCE_GLITCH_USER: UserCredentials = {
  username: 'performance_glitch_user',
  password: 'secret_sauce'
};

export const ERROR_USER: UserCredentials = {
  username: 'error_user',
  password: 'secret_sauce'
};

export const VISUAL_USER: UserCredentials = {
  username: 'visual_user',
  password: 'secret_sauce'
};

// Error messages
export const ERROR_MESSAGES = {
  LOCKED_OUT: 'Epic sadface: Sorry, this user has been locked out.',
  INVALID_CREDENTIALS: 'Epic sadface: Username and password do not match any user in this service',
  REQUIRED_USERNAME: 'Epic sadface: Username is required',
  REQUIRED_PASSWORD: 'Epic sadface: Password is required',
  REQUIRED_FIRSTNAME: 'Error: First Name is required',
  REQUIRED_LASTNAME: 'Error: Last Name is required',
  REQUIRED_POSTALCODE: 'Error: Postal Code is required'
};

// Test data for checkout
export const CHECKOUT_INFO = {
  firstName: 'John',
  lastName: 'Doe',
  postalCode: '12345'
};

// Product data
export const PRODUCTS = {
  BACKPACK: 'Sauce Labs Backpack',
  BIKE_LIGHT: 'Sauce Labs Bike Light',
  BOLT_TSHIRT: 'Sauce Labs Bolt T-Shirt',
  FLEECE_JACKET: 'Sauce Labs Fleece Jacket',
  ONESIE: 'Sauce Labs Onesie',
  RED_TSHIRT: 'Test.allTheThings() T-Shirt (Red)'
};

// Expected confirmation messages
export const MESSAGES = {
  ORDER_COMPLETE: 'Thank you for your order!'
};
