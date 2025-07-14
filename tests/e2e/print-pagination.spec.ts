import { test, expect } from '@playwright/test';

// This E2E test verifies that PDF generation works correctly for banner printing
test('Banner PDF generation works correctly', async ({ page }) => {
    // Go to the app
    await page.goto('/');

    // Select a template that creates a multi-page banner
    await page.getByRole('button', { name: 'Select Congratulations template' }).click();

    // Should be in editor mode
    await expect(page.getByText('Congratulations Banner')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Preview' })).toBeVisible();

    // Find and verify the PDF download button exists
    await expect(page.getByRole('button', { name: 'Download PDF' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Preview PDF' })).toBeVisible();

    // Test PDF preview functionality (opens in new tab)
    const [newPage] = await Promise.all([
        page.waitForEvent('popup'),
        page.getByRole('button', { name: 'Preview PDF' }).click()
    ]);

    // Verify the new page opened (PDF preview)
    expect(newPage).toBeDefined();
    await newPage.close();

    // Verify banner still works normally after PDF operations
    await expect(page.getByText('Banner Info')).toBeVisible();
    await expect(page.getByText('Actions')).toBeVisible();
});

// Test that the print button functionality still exists as backup
test('Browser print fallback still works', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Select Welcome Home template' }).click();

    // Verify browser print button exists
    await expect(page.getByRole('button', { name: 'Print (Browser)' })).toBeVisible();
});
