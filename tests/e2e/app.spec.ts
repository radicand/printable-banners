import { test, expect } from '@playwright/test';
import { BannerTestHelpers, TestData } from './helpers';

test.describe('Printable Banners App', () => {
    let helpers: BannerTestHelpers;

    test.beforeEach(async ({ page }) => {
        helpers = new BannerTestHelpers(page);
        await helpers.goToHomepage();
    });

    test('should display the landing page with templates', async ({ page }) => {
        // Check for main heading and subtitle
        await expect(page.getByRole('heading', { name: 'Create Your Perfect Banner' })).toBeVisible();
        await expect(page.getByText('Choose a template to get started, or create a custom banner from scratch')).toBeVisible();

        // Verify all template categories
        await helpers.verifyTemplateCategories();

        // Verify all template cards
        await helpers.verifyTemplateCard(
            TestData.templates.welcomeHome.name,
            TestData.templates.welcomeHome.description,
            TestData.templates.welcomeHome.previewTexts
        );

        await helpers.verifyTemplateCard(
            TestData.templates.congratulations.name,
            TestData.templates.congratulations.description,
            TestData.templates.congratulations.previewTexts
        );

        await helpers.verifyTemplateCard(
            TestData.templates.happyBirthday.name,
            TestData.templates.happyBirthday.description,
            TestData.templates.happyBirthday.previewTexts
        );

        await helpers.verifyTemplateCard(
            TestData.templates.blank.name,
            TestData.templates.blank.description,
            TestData.templates.blank.previewTexts
        );
    });

    test('should allow selecting welcome home template and enter editor', async ({ page }) => {
        await helpers.selectTemplate(TestData.templates.welcomeHome.name);
        await helpers.verifyBannerInfo(TestData.templates.welcomeHome.bannerTitle, '11" × 8.5" in', '2');
        await helpers.verifyActionsSection();
    });

    test('should allow adding text to banner', async ({ page }) => {
        await helpers.selectTemplate(TestData.templates.blank.name);
        await helpers.addTextToBanner(TestData.sampleTexts[0]);

        // Click on the newly added text element to select it
        await page.getByText(TestData.sampleTexts[0]).first().click();

        // Verify editing controls become available
        await expect(page.getByText('Edit Selected Text')).toBeVisible();
    });

    test('should allow toggling ink saver mode', async ({ page }) => {
        await helpers.selectTemplate(TestData.templates.welcomeHome.name);

        // Test enabling ink saver mode
        await helpers.toggleInkSaverMode(true);

        // Test disabling ink saver mode
        await helpers.toggleInkSaverMode(false);
    });

    test('should allow navigation back to templates', async ({ page }) => {
        await helpers.selectTemplate(TestData.templates.welcomeHome.name);
        await helpers.goBackToTemplates();
    });

    test('should handle new banner creation from header', async ({ page }) => {
        await helpers.selectTemplate(TestData.templates.welcomeHome.name);

        // Click "New Banner" in header
        await page.getByRole('button', { name: 'New Banner' }).click();

        // Should return to template selection
        await expect(page.getByRole('heading', { name: 'Create Your Perfect Banner' })).toBeVisible();
    });

    test('should maintain responsive layout', async ({ page }) => {
        await helpers.selectTemplate(TestData.templates.congratulations.name);
        await helpers.testResponsiveLayout();
    });
});
