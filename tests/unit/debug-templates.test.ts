import { describe, it, expect } from 'bun:test';
import { TemplateManager } from '../../src/core/template';

describe('Debug: Template Page Counts', () => {
    it('should show actual page counts for templates', () => {
        const welcomeHomeBanner = TemplateManager.createBannerFromTemplate('welcome-home');
        console.log('Welcome Home banner pages:', welcomeHomeBanner.pages.length);
        console.log('Welcome Home elements per page:', welcomeHomeBanner.pages.map(p => p.elements.length));

        const congratsBanner = TemplateManager.createBannerFromTemplate('congratulations');
        console.log('Congratulations banner pages:', congratsBanner.pages.length);

        const birthdayBanner = TemplateManager.createBannerFromTemplate('happy-birthday');
        console.log('Happy Birthday banner pages:', birthdayBanner.pages.length);

        const blankBanner = TemplateManager.createBannerFromTemplate('blank');
        console.log('Blank banner pages:', blankBanner.pages.length);

        // For test fixing, we need to know the actual values
        expect(welcomeHomeBanner.pages.length).toBeGreaterThanOrEqual(1);
    });
});
