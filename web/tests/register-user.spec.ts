import { test, expect } from '@playwright/test';

// Use serial mode so tests run in order and share the created user data
test.describe.configure({ mode: 'serial' });

test.describe('User Authentication Tests', () => {
  const name = 'TestUser';
  const password = 'password123';
  // Generates a unique email every time the test runs
  const email = `testuser_${Date.now()}@example.com`;

  test('1. Register User', async ({ page }) => {
    await page.goto('https://automationexercise.com/');
    await page.getByRole('link', { name: 'Signup / Login' }).click();

    // Signup section
    await page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Name').fill(name);
    await page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address').fill(email);
    await page.getByRole('button', { name: 'Signup' }).click();

    // Account Information
    await expect(page.getByText('Enter Account Information')).toBeVisible();
    await page.getByLabel('Password *').fill(password);
    await page.getByRole('checkbox', { name: 'Sign up for our newsletter!' }).check();

    // Address Information
    await page.getByLabel('First name *').fill('John');
    await page.getByLabel('Last name *').fill('Doe');
    await page.getByLabel('Address *').fill('123 Playwright St');
    await page.getByLabel('Country *').selectOption('Canada');
    await page.getByLabel('State *').fill('Ontario');
    await page.getByLabel('City *').fill('Toronto');
    await page.locator('#zipcode').fill('M5V 2N2');
    await page.getByLabel('Mobile Number *').fill('1234567890');

    await page.getByRole('button', { name: 'Create Account' }).click();
    await expect(page.getByText('Account Created!')).toBeVisible();
    await page.getByRole('link', { name: 'Continue' }).click();

    // Verify we are logged in then log out to prepare for the next test
    await expect(page.getByText(`Logged in as ${name}`)).toBeVisible();
    await page.getByRole('link', { name: 'Logout' }).click();
  });

  test('2. Login with Valid User', async ({ page }) => {
    await page.goto('https://automationexercise.com/login');

    // Fill in the credentials we created in Test 1
    await page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address').fill(email);
    await page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Password').fill(password);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText(`Logged in as ${name}`)).toBeVisible();
  });

  test('2-1. Log-out with Valid User', async ({ page }) => {
    await page.goto('https://automationexercise.com/login');

    // Fill in the credentials we created in Test 1
    await page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address').fill(email);
    await page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Password').fill(password);
    await page.getByRole('button', { name: 'Login' }).click();

    // 1. Verify we are successfully logged in
    await expect(page.getByText(`Logged in as ${name}`)).toBeVisible();

    // Verify logging out. 
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page).toHaveURL('https://automationexercise.com/login');
    await expect(page.getByText(`Logged in as ${name}`)).not.toBeVisible();
    await expect(page.getByRole('link', { name: 'Signup / Login' })).toBeVisible();
  });


  test('3. Login with Invalid User', async ({ page }) => {
    await page.goto('https://automationexercise.com/login');

    // Use a non-existent email
    await page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address').fill('invalid_user_99@test.com');
    await page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Login' }).click();

    // Verify error message (AutomationExercise shows this text on failed login)
    await expect(page.getByText('Your email or password is incorrect!')).toBeVisible();
  });

  // Cleanup: This runs after the other tests to delete the user
  test.afterAll('Cleanup', async ({ browser }) => {
    const context = await browser.newContext(); //new browser session 
    const page = await context.newPage(); //new tab in the sesion

    await page.goto('https://automationexercise.com/login');
    await page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address').fill(email);
    await page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Password').fill(password);
    await page.getByRole('button', { name: 'Login' }).click();

    // Delete the account
    await page.getByRole('link', { name: 'Delete Account' }).click();
    await expect(page.getByText('Account Deleted!')).toBeVisible();
    await page.getByRole('link', { name: 'Continue' }).click();

    await context.close();
  });
});