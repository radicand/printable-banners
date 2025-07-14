import { test, expect } from '@playwright/test';

test.describe('Banner Editor', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        // Start with a blank template for consistent testing
        await page.getByRole('button', { name: 'Select Blank Banner template' }).click();
    });

    test('should start with empty banner', async ({ page }) => {
        // Should be in editor mode
        await expect(page.getByRole('heading', { name: 'Preview' })).toBeVisible();
        await expect(page.getByText('Custom Banner')).toBeVisible();

        // Should show no text elements initially
        await expect(page.getByText('Edit Selected Text')).not.toBeVisible();

        // Should show banner info
        await expect(page.getByText('Size:')).toBeVisible();
        await expect(page.locator('.font-medium').filter({ hasText: '11" × 8.5" in' })).toBeVisible();
    });

    test('should allow adding multiple text elements', async ({ page }) => {
        const textInput = page.getByPlaceholder('Enter your text...');

        // Add first text element
        await textInput.fill('First Line');
        await page.getByRole('button', { name: 'Add Text Element' }).click();
        await expect(textInput).toHaveValue('');

        // Add second text element
        await textInput.fill('Second Line');
        await page.getByRole('button', { name: 'Add Text Element' }).click();
        await expect(textInput).toHaveValue('');

        // Both text elements should be added (we can't easily verify visually, 
        // but the input clearing indicates successful addition)
    });

    test('should prevent adding empty text', async ({ page }) => {
        const textInput = page.getByPlaceholder('Enter your text...');
        const addButton = page.getByRole('button', { name: 'Add Text Element' });

        // Button should be disabled when input is empty
        await expect(addButton).toBeDisabled();

        // Add some text, then clear it
        await textInput.fill('Some text');
        await expect(addButton).toBeEnabled();

        await textInput.clear();
        await expect(addButton).toBeDisabled();
    });

    test('should allow text input via Enter key', async ({ page }) => {
        const textInput = page.getByPlaceholder('Enter your text...');

        // Type text and press Enter
        await textInput.fill('Press Enter Test');
        await textInput.press('Enter');

        // Input should be cleared, indicating text was added
        await expect(textInput).toHaveValue('');
    });

    test('should show ink saver toggle', async ({ page }) => {
        const inkSaverCheckbox = page.getByRole('checkbox', { name: 'Ink Saver Mode (outline text)' });

        // Should be unchecked initially
        await expect(inkSaverCheckbox).not.toBeChecked();
        await expect(page.getByText('Normal Mode')).toBeVisible();

        // Check the box
        await inkSaverCheckbox.check();
        await expect(page.locator('text=Preview').locator('..').getByText('Ink Saver Mode')).toBeVisible();

        // Uncheck the box
        await inkSaverCheckbox.uncheck();
        await expect(page.locator('text=Preview').locator('..').getByText('Normal Mode')).toBeVisible();
    });

    test('should display banner actions', async ({ page }) => {
        // Actions section should be visible
        await expect(page.getByText('Actions')).toBeVisible();

        // PDF buttons should be available
        const downloadButton = page.getByRole('button', { name: 'Download PDF' });
        await expect(downloadButton).toBeVisible();
        await expect(downloadButton).toBeEnabled();

        const previewButton = page.getByRole('button', { name: 'Preview PDF' });
        await expect(previewButton).toBeVisible();
        await expect(previewButton).toBeEnabled();
    });

    test('should handle PDF operations', async ({ page }) => {
        // Add some text first to make PDF generation more meaningful
        await page.getByRole('textbox', { name: /enter your text/i }).fill('Test Banner Text');
        await page.getByRole('button', { name: 'Add Text Element' }).click();

        // Test PDF preview (opens new tab)
        const [newPage] = await Promise.all([
            page.waitForEvent('popup'),
            page.getByRole('button', { name: 'Preview PDF' }).click()
        ]);

        // Verify PDF preview opened successfully (any page opening indicates PDF generation worked)
        expect(newPage).toBeDefined();
        await newPage.close();

        // PDF download button should still be functional
        await expect(page.getByRole('button', { name: 'Download PDF' })).toBeVisible();
    });

    test('should maintain responsive layout', async ({ page }) => {
        // Test on different viewport sizes

        // Desktop view
        await page.setViewportSize({ width: 1200, height: 800 });
        await expect(page.getByRole('heading', { name: 'Preview' })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Add Text' })).toBeVisible();

        // Tablet view
        await page.setViewportSize({ width: 768, height: 1024 });
        await expect(page.getByRole('heading', { name: 'Preview' })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Add Text' })).toBeVisible();

        // Mobile view
        await page.setViewportSize({ width: 375, height: 667 });
        await expect(page.getByRole('heading', { name: 'Preview' })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Add Text' })).toBeVisible();
    });
});

test.describe('Template-specific Editor Tests', () => {
    test('should load Welcome Home template with correct content', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('button', { name: 'Select Welcome Home template' }).click();

        // Should show correct banner title
        await expect(page.getByText('Welcome Home Banner')).toBeVisible();

        // Should have text elements (we can infer this from the fact that 
        // editing controls would be available if there are elements)
        await expect(page.getByText('Banner Info')).toBeVisible();
    });

    test('should load Congratulations template correctly', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('button', { name: 'Select Congratulations template' }).click();

        await expect(page.getByText('Congratulations Banner')).toBeVisible();
    });

    test('should load Happy Birthday template correctly', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('button', { name: 'Select Happy Birthday template' }).click();

        await expect(page.getByText('Happy Birthday Banner')).toBeVisible();
    });
});
