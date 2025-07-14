import { Page, expect } from '@playwright/test';

/**
 * Helper functions for banner app testing
 */
export class BannerTestHelpers {
    constructor(private page: Page) { }

    /**
     * Navigate to the app homepage
     */
    async goToHomepage() {
        await this.page.goto('/');
        await expect(this.page.getByRole('heading', { name: 'Create Your Perfect Banner' })).toBeVisible();
    }

    /**
     * Select a template by name and verify navigation to editor
     */
    async selectTemplate(templateName: string) {
        await this.page.getByRole('button', { name: `Select ${templateName} template` }).click();
        await expect(this.page.getByRole('button', { name: '← Back to Templates' })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: 'Preview' })).toBeVisible();
    }

    /**
     * Add text to the current banner
     */
    async addTextToBanner(text: string) {
        const textInput = this.page.getByPlaceholder('Enter your text...');
        await textInput.fill(text);
        await this.page.getByRole('button', { name: 'Add Text Element' }).click();
        await expect(textInput).toHaveValue(''); // Verify input was cleared
    }

    /**
     * Toggle ink saver mode
     */
    async toggleInkSaverMode(enable: boolean = true) {
        const checkbox = this.page.getByRole('checkbox', { name: 'Ink Saver Mode (outline text)' });
        if (enable) {
            await checkbox.check();
            // Look for ink saver status in the preview section
            await expect(this.page.locator('text=Preview').locator('..').getByText('Ink Saver Mode')).toBeVisible();
        } else {
            await checkbox.uncheck();
            await expect(this.page.locator('text=Preview').locator('..').getByText('Normal Mode')).toBeVisible();
        }
    }

    /**
     * Navigate back to template selection
     */
    async goBackToTemplates() {
        await this.page.getByRole('button', { name: '← Back to Templates' }).click();
        await expect(this.page.getByRole('heading', { name: 'Create Your Perfect Banner' })).toBeVisible();
    }    /**
     * Verify template card information
     */
    async verifyTemplateCard(templateName: string, description: string, previewTexts?: string[]) {
        const card = this.page.locator(`[aria-label="Select ${templateName} template"]`);
        await expect(card).toBeVisible();
        await expect(card.getByRole('heading', { level: 3 })).toContainText(templateName);
        await expect(card.getByText(description)).toBeVisible();

        if (previewTexts) {
            for (const text of previewTexts) {
                // Look for preview text specifically in the preview area
                await expect(card.locator('.aspect-video').getByText(text)).toBeVisible();
            }
        }
    }

    /**
     * Verify banner info section
     */
    async verifyBannerInfo(title: string, size: string = '11" × 8.5" in', pages: string = '1') {
        const bannerInfoSection = this.page.locator('text=Banner Info').locator('..');
        await expect(bannerInfoSection.getByText('Banner Info')).toBeVisible();
        await expect(bannerInfoSection.getByText(`Title:`)).toBeVisible();
        await expect(bannerInfoSection.getByText(title)).toBeVisible();
        await expect(bannerInfoSection.getByText(`Size:`)).toBeVisible();
        await expect(bannerInfoSection.locator('.font-medium').filter({ hasText: size })).toBeVisible();
        await expect(bannerInfoSection.getByText(`Pages:`)).toBeVisible();
        await expect(bannerInfoSection.getByText(pages, { exact: true })).toBeVisible();
    }

    /**
     * Verify actions section
     */
    async verifyActionsSection() {
        await expect(this.page.getByText('Actions')).toBeVisible();
        await expect(this.page.getByRole('button', { name: 'Download PDF' })).toBeVisible();
        await expect(this.page.getByRole('button', { name: 'Preview PDF' })).toBeVisible();
    }    /**
     * Check responsive layout at different viewport sizes (tablet and desktop only)
     */
    async testResponsiveLayout() {
        const viewports = [
            { width: 1200, height: 800, name: 'Desktop' },
            { width: 768, height: 1024, name: 'Tablet' }
        ];

        for (const viewport of viewports) {
            await this.page.setViewportSize({ width: viewport.width, height: viewport.height });

            // Verify key elements are still visible
            await expect(this.page.getByRole('heading', { name: 'Preview' })).toBeVisible();
            await expect(this.page.getByRole('heading', { name: 'Add Text' })).toBeVisible();
        }
    }

    /**
     * Wait for template cards to load
     */
    async waitForTemplatesLoad() {
        await expect(this.page.locator('[aria-label*="template"]')).toHaveCount(5);
    }

    /**
     * Verify all template categories are present
     */
    async verifyTemplateCategories() {
        await expect(this.page.getByRole('heading', { name: /Welcome.*\(1\)/ })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: /Celebration.*\(3\)/ })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: /Custom.*\(1\)/ })).toBeVisible();
    }
}

/**
 * Common test data
 */
export const TestData = {
    templates: {
        welcomeHome: {
            name: 'Welcome Home',
            description: 'Perfect for welcoming someone back home',
            previewTexts: ['WELCOME', 'HOME!'],
            bannerTitle: 'Welcome Home Banner'
        },
        congratulations: {
            name: 'Congratulations',
            description: 'Celebrate achievements and milestones',
            previewTexts: ['CONGRATULATIONS!'],
            bannerTitle: 'Congratulations Banner'
        },
        happyBirthday: {
            name: 'Happy Birthday',
            description: 'Birthday celebration banner',
            previewTexts: ['HAPPY', 'BIRTHDAY!'],
            bannerTitle: 'Happy Birthday Banner'
        },
        partyTime: {
            name: 'Party Time',
            description: 'Ultimate celebration banner with full decorative elements',
            previewTexts: ['PARTY', 'TIME!'],
            bannerTitle: 'Party Time Banner'
        },
        blank: {
            name: 'Blank Banner',
            description: 'Start with a completely blank banner',
            previewTexts: ['Blank Template'],
            bannerTitle: 'Custom Banner'
        }
    },
    sampleTexts: [
        'Welcome Home!',
        'Congratulations Graduate!',
        'Happy Birthday Sarah!',
        'Test Banner Text',
        'Sample Text Element'
    ]
};
