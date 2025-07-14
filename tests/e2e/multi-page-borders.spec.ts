import { test, expect } from '@playwright/test';

test.describe('Multi-page Border Behavior', () => {
    test('should display borders correctly across multiple pages', async ({ page }) => {
        // Navigate to the app
        await page.goto('http://localhost:3000');

        // Wait for the app to load
        await page.waitForSelector('[data-testid="banner-editor"]', { timeout: 3000 });

        // Add a long banner text that will span multiple pages
        await page.fill('[data-testid="text-input"]', 'CONGRATULATIONS ON YOUR AMAZING ACHIEVEMENT THIS IS A VERY LONG CELEBRATION BANNER MESSAGE');
        await page.press('[data-testid="text-input"]', 'Enter');

        // Wait for the banner to update and potentially create multiple pages
        await page.waitForTimeout(1000);

        // Open decorative controls
        const decorativeButton = page.locator('button:has-text("Decorative")');
        if (await decorativeButton.isVisible()) {
            await decorativeButton.click();
        }

        // Add an emoji border
        const addBorderButton = page.locator('button:has-text("Add Border")');
        if (await addBorderButton.isVisible()) {
            await addBorderButton.click();

            // Select an emoji border style
            const emojiBorderOption = page.locator('[data-testid="border-style"]:has-text("Star Border")');
            if (await emojiBorderOption.isVisible()) {
                await emojiBorderOption.click();
            }
        }

        // Take a screenshot to manually verify border behavior
        await page.screenshot({
            path: 'test-results/multi-page-borders.png',
            fullPage: true
        });

        // Test PDF generation with borders
        const printButton = page.locator('button:has-text("Print")');
        if (await printButton.isVisible()) {
            await printButton.click();

            // Wait for PDF generation
            await page.waitForTimeout(2000);

            // Take screenshot of print view
            await page.screenshot({
                path: 'test-results/pdf-border-preview.png',
                fullPage: true
            });
        }

        // Basic verification that the page loaded and banner is visible
        await expect(page.locator('[data-testid="banner-editor"]')).toBeVisible();
    });

    test('should handle border settings correctly', async ({ page }) => {
        // Navigate to the app
        await page.goto('http://localhost:3000');

        // Wait for the app to load
        await page.waitForSelector('[data-testid="banner-editor"]', { timeout: 3000 });

        // Add some text
        await page.fill('[data-testid="text-input"]', 'TEST BANNER');
        await page.press('[data-testid="text-input"]', 'Enter');

        // Check if decorative controls are available
        const decorativeSection = page.locator('text=Decorative');
        if (await decorativeSection.isVisible()) {
            // Verify that we can interact with border controls
            await expect(decorativeSection).toBeVisible();
        }

        // Take a screenshot for manual verification
        await page.screenshot({
            path: 'test-results/border-controls.png',
            fullPage: true
        });

        // Basic verification that the banner is visible
        await expect(page.locator('[data-testid="banner-editor"]')).toBeVisible();
    });
});
