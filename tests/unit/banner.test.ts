import { describe, expect, it } from 'bun:test';
import { BannerFactory, BannerUtils, DEFAULT_BANNER_CONFIG } from '../../src/core/banner';

describe('BannerFactory', () => {
    it('should create an empty banner with default dimensions', () => {
        const banner = BannerFactory.createEmptyBanner('Test Banner');

        expect(banner.title).toBe('Test Banner');
        expect(banner.dimensions).toEqual(DEFAULT_BANNER_CONFIG.dimensions);
        expect(banner.pages).toHaveLength(1);
        expect(banner.pages[0].elements).toHaveLength(0);
        expect(banner.inkSaverMode).toBe(false);
    });

    it('should create a banner with custom dimensions', () => {
        const customDimensions = { width: 10, height: 12, unit: 'in' as const };
        const banner = BannerFactory.createEmptyBanner('Custom Banner', customDimensions);

        expect(banner.dimensions).toEqual(customDimensions);
    });

    it('should create a banner with text', () => {
        const banner = BannerFactory.createBannerWithText('Text Banner', 'Hello World');

        expect(banner.title).toBe('Text Banner');
        expect(banner.pages[0].elements).toHaveLength(1);
        expect(banner.pages[0].elements[0].text).toBe('Hello World');
        expect(banner.pages[0].elements[0].fontSize).toBe(360); // Updated for actual print sizing (11 chars = 360px print size)
    });
});

describe('BannerUtils', () => {
    it('should add text element to banner', () => {
        const banner = BannerFactory.createEmptyBanner('Test');
        const updatedBanner = BannerUtils.addTextElement(banner, 'New Text');

        expect(updatedBanner.pages[0].elements).toHaveLength(1);
        expect(updatedBanner.pages[0].elements[0].text).toBe('New Text');
        // Check that the banner was updated (new reference)
        expect(updatedBanner).not.toBe(banner);
    });

    it('should update text element properties', () => {
        const banner = BannerFactory.createBannerWithText('Test', 'Original');
        const elementId = banner.pages[0].elements[0].id;

        const updatedBanner = BannerUtils.updateTextElement(banner, elementId, {
            text: 'Updated Text',
            fontSize: 100,
            color: '#ff0000'
        });

        const element = updatedBanner.pages[0].elements[0];
        expect(element.text).toBe('Updated Text');
        expect(element.fontSize).toBe(100);
        expect(element.color).toBe('#ff0000');
    });

    it('should toggle ink saver mode', () => {
        const banner = BannerFactory.createBannerWithText('Test', 'Hello');

        // Initially ink saver mode is off
        expect(banner.inkSaverMode).toBe(false);
        expect(banner.pages[0].elements[0].outline).toBe(false);

        // Toggle on
        const toggled = BannerUtils.toggleInkSaverMode(banner);
        expect(toggled.inkSaverMode).toBe(true);
        expect(toggled.pages[0].elements[0].outline).toBe(true);

        // Toggle off
        const toggledOff = BannerUtils.toggleInkSaverMode(toggled);
        expect(toggledOff.inkSaverMode).toBe(false);
        expect(toggledOff.pages[0].elements[0].outline).toBe(false);
    });

    it('should add new pages', () => {
        const banner = BannerFactory.createEmptyBanner('Test');
        expect(banner.pages).toHaveLength(1);

        const withNewPage = BannerUtils.addPage(banner);
        expect(withNewPage.pages).toHaveLength(2);
        expect(withNewPage.pages[1].pageNumber).toBe(2);
    });

    it('should calculate total pages correctly', () => {
        const banner = BannerFactory.createEmptyBanner('Test');
        expect(BannerUtils.calculateTotalPages(banner)).toBe(1);

        const withPages = BannerUtils.addPage(BannerUtils.addPage(banner));
        expect(BannerUtils.calculateTotalPages(withPages)).toBe(3);
    });
});

// Note: Page estimation tests are handled by E2E tests since they depend on browser APIs
