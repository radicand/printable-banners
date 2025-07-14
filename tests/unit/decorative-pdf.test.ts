/**
 * Tests for decorative elements in PDF generation
 */

import { describe, expect, it } from 'bun:test';
import { BannerFactory } from '../../src/core/banner';
import { createDefaultBorder, BORDER_STYLES } from '../../src/core/decorative';
import { BannerPDFGenerator } from '../../src/core/pdf';

describe('PDF Decorative Elements', () => {
    it('should generate PDF with emoji borders using symbols', () => {
        // Create a banner with emoji border
        const banner = BannerFactory.createBannerWithText('Test Banner', 'WELCOME');

        // Add emoji border
        const emojiBorder = createDefaultBorder('star-pattern');
        emojiBorder.style = BORDER_STYLES.find(s => s.id === 'star-pattern')!;
        banner.decorative.borders.push(emojiBorder);

        // Generate PDF (should not throw errors)
        expect(() => {
            BannerPDFGenerator.generatePDF(banner, { download: false });
        }).not.toThrow();
    });

    it('should generate PDF with line borders', () => {
        const banner = BannerFactory.createBannerWithText('Test Banner', 'WELCOME');

        // Add solid border
        const solidBorder = createDefaultBorder('solid-thick');
        solidBorder.style = BORDER_STYLES.find(s => s.id === 'solid-thick')!;
        banner.decorative.borders.push(solidBorder);

        // Generate PDF (should not throw errors)
        expect(() => {
            BannerPDFGenerator.generatePDF(banner, { download: false });
        }).not.toThrow();
    });

    it('should generate PDF with individual emojis', () => {
        const banner = BannerFactory.createBannerWithText('Test Banner', 'WELCOME');

        // Add individual emoji
        banner.decorative.emojis.push({
            id: 'test-emoji',
            emoji: '🎉',
            x: 50,
            y: 25,
            size: 24,
            rotation: 0
        });

        // Generate PDF (should not throw errors)
        expect(() => {
            BannerPDFGenerator.generatePDF(banner, { download: false });
        }).not.toThrow();
    });
});
