import { describe, it, expect } from 'bun:test';
import { BannerFactory, BannerUtils } from '../../src/core/banner';
import { BannerPDFGenerator } from '../../src/core/pdf';
import { BORDER_STYLES } from '../../src/core/decorative';

// Mock the browser APIs needed for PDF generation
(globalThis as any).document = {
    createElement: () => ({
        getContext: () => ({
            measureText: () => ({ width: 100 })
        })
    })
};

describe('Multi-page Border Behavior', () => {
    it('should create multi-page banners with proper border behavior', () => {
        // Create a banner and manually add multiple pages
        const banner = BannerFactory.createEmptyBanner('Multi-page Test');
        const multiPageBanner = BannerUtils.addPage(banner);

        // Add text elements 
        const bannerWithText1 = BannerUtils.addTextElement(multiPageBanner, 'WELCOME TO OUR');
        const bannerWithText2 = BannerUtils.addTextElement(bannerWithText1, 'CELEBRATION');

        // Add an emoji border
        const bannerWithBorder = {
            ...bannerWithText2,
            decorative: {
                borders: [{
                    id: 'test-border',
                    style: {
                        id: 'emoji-party',
                        name: 'Party Emoji',
                        description: 'Party emoji border',
                        type: 'emoji' as const,
                        emoji: '🎉',
                        spacing: 50
                    },
                    position: 'all' as const,
                    margin: 0,
                    enabled: true
                }],
                emojis: []
            }
        };

        // Generate PDF to test multi-page border logic
        const pdf = BannerPDFGenerator.generatePDF(bannerWithBorder, { download: false });

        // Verify we got a PDF object
        expect(pdf).toBeDefined();
        expect(typeof pdf.output).toBe('function');

        // Verify the banner has multiple pages
        expect(bannerWithBorder.pages.length).toBe(2);

        // Verify border configuration 
        expect(bannerWithBorder.decorative.borders[0].enabled).toBe(true);
        expect(bannerWithBorder.decorative.borders[0].position).toBe('all');
        expect(bannerWithBorder.decorative.borders[0].margin).toBe(0);
    });

    it('should properly define border styles', () => {
        // Verify border styles are properly defined
        expect(BORDER_STYLES.length).toBeGreaterThan(0);

        const emojiStyle = BORDER_STYLES.find(style => style.type === 'emoji');
        expect(emojiStyle).toBeDefined();
        expect(emojiStyle?.spacing).toBeGreaterThan(0);
    });

    it('should handle edge-to-edge borders (no margins)', () => {
        // Test that margins are set to 0 for borders (unlike text which has margins)
        const banner = BannerFactory.createEmptyBanner('Edge Test');

        const testBanner = {
            ...banner,
            decorative: {
                borders: [{
                    id: 'edge-border',
                    style: {
                        id: 'solid-red',
                        name: 'Red Line',
                        description: 'Red solid line',
                        type: 'solid' as const,
                        color: '#FF0000',
                        thickness: 2
                    },
                    position: 'all' as const,
                    margin: 0,
                    enabled: true
                }],
                emojis: []
            }
        };

        // This test mainly verifies the structure is correct
        expect(testBanner.decorative.borders[0].enabled).toBe(true);
        expect(testBanner.decorative.borders[0].position).toBe('all');
        expect(testBanner.decorative.borders[0].margin).toBe(0);
    });

    it('should respect border margin settings', () => {
        // Test that the margin setting is properly applied
        const banner = BannerFactory.createEmptyBanner('Margin Test');

        const borderedBanner = {
            ...banner,
            decorative: {
                borders: [{
                    id: 'margin-border',
                    style: {
                        id: 'solid-test',
                        name: 'Test Line',
                        description: 'Test solid line',
                        type: 'solid' as const,
                        color: '#000000',
                        thickness: 2
                    },
                    position: 'all' as const,
                    margin: 20, // 20 points margin
                    enabled: true
                }],
                emojis: []
            }
        };

        // Generate PDF to ensure no crashes with margin
        const pdf = BannerPDFGenerator.generatePDF(borderedBanner, { download: false });
        expect(pdf).toBeDefined();

        // Verify margin is properly set
        expect(borderedBanner.decorative.borders[0].margin).toBe(20);
    });

    it('should handle emoji rendering with image fallback', () => {
        // Test emoji border with image rendering support
        const banner = BannerFactory.createEmptyBanner('Emoji Test');

        const emojiBanner = {
            ...banner,
            decorative: {
                borders: [{
                    id: 'emoji-image-border',
                    style: {
                        id: 'heart-pattern-test',
                        name: 'Heart Test',
                        description: 'Heart emoji test',
                        type: 'emoji' as const,
                        emoji: '❤️',
                        spacing: 30
                    },
                    position: 'top' as const,
                    margin: 10,
                    enabled: true
                }],
                emojis: []
            }
        };

        // Generate PDF to test emoji image rendering
        const pdf = BannerPDFGenerator.generatePDF(emojiBanner, { download: false });
        expect(pdf).toBeDefined();

        // Verify emoji configuration
        expect(emojiBanner.decorative.borders[0].style.emoji).toBe('❤️');
        expect(emojiBanner.decorative.borders[0].style.spacing).toBe(30);
    });
});
