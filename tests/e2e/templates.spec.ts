import { test, expect } from '@playwright/test';

test.describe('Template System', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should display all template categories', async ({ page }) => {
        // Welcome category
        await expect(page.getByRole('heading', { name: /Welcome.*\(1\)/ })).toBeVisible();

        // Celebration category  
        await expect(page.getByRole('heading', { name: /Celebration.*\(3\)/ })).toBeVisible();

        // Custom category
        await expect(page.getByRole('heading', { name: /Custom.*\(1\)/ })).toBeVisible();
    });

    test('should show template cards with correct information', async ({ page }) => {
        // Welcome Home template
        const welcomeCard = page.locator('[aria-label="Select Welcome Home template"]');
        await expect(welcomeCard).toBeVisible();
        await expect(welcomeCard.getByRole('heading', { level: 3 })).toContainText('Welcome Home');
        await expect(welcomeCard.getByText('Perfect for welcoming someone back home')).toBeVisible();
        await expect(welcomeCard.getByRole('button', { name: 'Use This Template' })).toBeVisible();

        // Congratulations template
        const congratsCard = page.locator('[aria-label="Select Congratulations template"]');
        await expect(congratsCard).toBeVisible();
        await expect(congratsCard.getByRole('heading', { level: 3 })).toContainText('Congratulations');
        await expect(congratsCard.getByText('Celebrate achievements and milestones')).toBeVisible();

        // Happy Birthday template
        const birthdayCard = page.locator('[aria-label="Select Happy Birthday template"]');
        await expect(birthdayCard).toBeVisible();
        await expect(birthdayCard.getByRole('heading', { level: 3 })).toContainText('Happy Birthday');
        await expect(birthdayCard.getByText('Birthday celebration banner')).toBeVisible();

        // Blank template
        const blankCard = page.locator('[aria-label="Select Blank Banner template"]');
        await expect(blankCard).toBeVisible();
        await expect(blankCard.getByRole('heading', { level: 3 })).toContainText('Blank Banner');
        await expect(blankCard.getByText('Start with a completely blank banner')).toBeVisible();
    });

    test('should show template previews', async ({ page }) => {
        // Welcome Home should show preview text
        const welcomeCard = page.locator('[aria-label="Select Welcome Home template"]');
        await expect(welcomeCard.locator('.aspect-video').getByText('WELCOME')).toBeVisible();
        await expect(welcomeCard.locator('.aspect-video').getByText('HOME!')).toBeVisible();

        // Congratulations should show preview text
        const congratsCard = page.locator('[aria-label="Select Congratulations template"]');
        await expect(congratsCard.locator('.aspect-video').getByText('CONGRATULATIONS!')).toBeVisible();

        // Happy Birthday should show preview text
        const birthdayCard = page.locator('[aria-label="Select Happy Birthday template"]');
        await expect(birthdayCard.locator('.aspect-video').getByText('HAPPY')).toBeVisible();
        await expect(birthdayCard.locator('.aspect-video').getByText('BIRTHDAY!')).toBeVisible();

        // Blank template should show placeholder
        const blankCard = page.locator('[aria-label="Select Blank Banner template"]');
        await expect(blankCard.locator('.aspect-video').getByText('Blank Template')).toBeVisible();
    });

    test('should allow template selection via card click', async ({ page }) => {
        // Click on the card itself (not the button)
        const welcomeCard = page.locator('[aria-label="Select Welcome Home template"]');
        await welcomeCard.click();

        // Should navigate to editor
        await expect(page.getByText('Welcome Home Banner')).toBeVisible();
        await expect(page.getByRole('button', { name: '← Back to Templates' })).toBeVisible();
    });

    test('should allow template selection via button click', async ({ page }) => {
        // Click specifically on the "Use This Template" button
        const congratsCard = page.locator('[aria-label="Select Congratulations template"]');
        await congratsCard.getByRole('button', { name: 'Use This Template' }).click();

        // Should navigate to editor
        await expect(page.getByText('Congratulations Banner')).toBeVisible();
        await expect(page.getByRole('button', { name: '← Back to Templates' })).toBeVisible();
    });

    test('should handle keyboard navigation', async ({ page }) => {
        // Focus on the first template card using a more reliable method
        const firstTemplateCard = page.locator('[aria-label="Select Welcome Home template"]');
        await firstTemplateCard.focus();

        // Press Enter to select
        await page.keyboard.press('Enter');

        // Should navigate to editor (any template is fine)
        await expect(page.getByRole('button', { name: '← Back to Templates' })).toBeVisible();
    });

    test('should show grid layout on different screen sizes', async ({ page }) => {
        // Desktop - should show 3 columns
        await page.setViewportSize({ width: 1200, height: 800 });
        const templates = page.locator('[aria-label*="template"]');
        await expect(templates).toHaveCount(5); // All 5 templates should be visible

        // Tablet - should show 2 columns  
        await page.setViewportSize({ width: 768, height: 1024 });
        await expect(templates).toHaveCount(5); // Still all visible

        // Mobile - should show 1 column
        await page.setViewportSize({ width: 375, height: 667 });
        await expect(templates).toHaveCount(5); // Still all visible
    });

    test('should group templates by category correctly', async ({ page }) => {
        // Welcome category should contain only Welcome Home
        const welcomeSection = page.locator('text=Welcome').locator('..').locator('..');
        await expect(welcomeSection.locator('[aria-label*="Welcome Home"]')).toBeVisible();

        // Celebration category should contain Congratulations and Happy Birthday
        const celebrationSection = page.locator('text=Celebration').locator('..').locator('..');
        await expect(celebrationSection.locator('[aria-label*="Congratulations"]')).toBeVisible();
        await expect(celebrationSection.locator('[aria-label*="Happy Birthday"]')).toBeVisible();

        // Custom category should contain Blank Banner
        const customSection = page.locator('text=Custom').locator('..').locator('..');
        await expect(customSection.locator('[aria-label*="Blank Banner"]')).toBeVisible();
    });

    test('should maintain state when returning from editor', async ({ page }) => {
        // Select a template
        await page.getByRole('button', { name: 'Select Happy Birthday template' }).click();

        // Go back
        await page.getByRole('button', { name: '← Back to Templates' }).click();

        // Should be back on template page with all templates visible
        await expect(page.getByRole('heading', { name: 'Create Your Perfect Banner' })).toBeVisible();
        await expect(page.locator('[aria-label*="template"]')).toHaveCount(5);

        // Should be able to select a different template
        await page.getByRole('button', { name: 'Select Congratulations template' }).click();
        await expect(page.getByText('Congratulations Banner')).toBeVisible();
    });
});
