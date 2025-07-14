import { describe, it, expect } from 'bun:test';
import { BannerPDFGenerator } from '../../src/core/pdf';
import { TemplateManager } from '../../src/core/template';
import { BannerFactory, BannerUtils } from '../../src/core/banner';

// Mock the browser APIs needed for PDF generation
(globalThis as any).document = {
    createElement: () => ({
        getContext: () => ({
            measureText: () => ({ width: 100 })
        })
    })
};

(globalThis as any).window = {};
(globalThis as any).URL = {
    createObjectURL: () => 'blob:test-url',
    revokeObjectURL: () => { }
};

describe('PDF Generation', () => {
    it('should generate PDF for Welcome Home banner', () => {
        const banner = TemplateManager.createBannerFromTemplate('welcome-home');

        // Generate PDF without downloading
        const pdf = BannerPDFGenerator.generatePDF(banner, { download: false });

        // Verify PDF was created
        expect(pdf).toBeDefined();
        expect(typeof pdf.output).toBe('function');

        // Verify PDF has correct number of pages
        expect(pdf.getNumberOfPages()).toBe(banner.pages.length);
    });

    it('should generate PDF for Congratulations banner', () => {
        const banner = TemplateManager.createBannerFromTemplate('congratulations');

        const pdf = BannerPDFGenerator.generatePDF(banner, { download: false });
        expect(pdf).toBeDefined();
        expect(pdf.getNumberOfPages()).toBe(banner.pages.length);
    });

    it('should generate preview URL for PDF', () => {
        const banner = TemplateManager.createBannerFromTemplate('happy-birthday');

        const previewUrl = BannerPDFGenerator.generatePreviewUrl(banner);

        // Verify URL format (our mocked URL)
        expect(previewUrl).toBe('blob:test-url');
        expect(typeof previewUrl).toBe('string');
    });

    it('should generate PDF buffer', () => {
        const banner = TemplateManager.createBannerFromTemplate('blank');

        const buffer = BannerPDFGenerator.generatePDFBuffer(banner);

        expect(buffer).toBeInstanceOf(Uint8Array);
        expect(buffer.length).toBeGreaterThan(0);
    });

    it('should handle ink saver mode correctly', () => {
        const banner = TemplateManager.createBannerFromTemplate('welcome-home');

        // Generate PDF with ink saver mode
        const pdf = BannerPDFGenerator.generatePDF(banner, {
            download: false,
            inkSaverMode: true
        });

        expect(pdf).toBeDefined();
        expect(pdf.getNumberOfPages()).toBe(banner.pages.length);
    });

    it('should properly implement ink saver mode with outline text - REGRESSION TEST', () => {
        // Create a banner with text elements
        const banner = TemplateManager.createBannerFromTemplate('welcome-home');

        // Verify the banner has ink saver mode disabled initially
        expect(banner.inkSaverMode).toBe(false);

        // Test 1: Generate PDF without ink saver mode
        const normalPdf = BannerPDFGenerator.generatePDF(banner, {
            download: false,
            inkSaverMode: false
        });

        // Test 2: Generate PDF with ink saver mode enabled
        const inkSaverPdf = BannerPDFGenerator.generatePDF(banner, {
            download: false,
            inkSaverMode: true
        });

        // Both PDFs should be generated successfully
        expect(normalPdf).toBeDefined();
        expect(inkSaverPdf).toBeDefined();
        expect(normalPdf.getNumberOfPages()).toBe(inkSaverPdf.getNumberOfPages());

        // Convert to string to verify they contain different content
        const normalPdfStr = normalPdf.output('datauristring');
        const inkSaverPdfStr = inkSaverPdf.output('datauristring');

        // PDFs should have different content due to ink saver mode
        expect(normalPdfStr.length).toBeGreaterThan(100);
        expect(inkSaverPdfStr.length).toBeGreaterThan(100);

        // The content should be different (outline vs solid text)
        // This is the key regression test - if ink saver isn't working, these will be identical
        expect(normalPdfStr).not.toBe(inkSaverPdfStr);

        // Test 3: Verify that banner-level ink saver mode is respected
        const inkSaverBanner = BannerUtils.toggleInkSaverMode(banner);
        expect(inkSaverBanner.inkSaverMode).toBe(true);

        // When banner has ink saver mode, PDF should use it by default
        const bannerInkSaverPdf = BannerPDFGenerator.generatePDF(inkSaverBanner, {
            download: false
            // No explicit inkSaverMode - should use banner's setting
        });

        expect(bannerInkSaverPdf).toBeDefined();
        const bannerInkSaverStr = bannerInkSaverPdf.output('datauristring');

        // This should be similar to explicitly setting inkSaverMode: true
        expect(bannerInkSaverStr.length).toBeGreaterThan(100);

        // Test 4: Verify individual element outline property is handled
        const testBanner = BannerFactory.createBannerWithText('Test Outline', 'TEST OUTLINE');
        const elementId = testBanner.pages[0].elements[0].id;

        // Set individual element to outline mode
        const outlineElementBanner = BannerUtils.updateTextElement(testBanner, elementId, {
            outline: true
        });

        const outlineElementPdf = BannerPDFGenerator.generatePDF(outlineElementBanner, {
            download: false,
            inkSaverMode: false // Banner ink saver is off, but element outline is on
        });

        expect(outlineElementPdf).toBeDefined();
        const outlineElementStr = outlineElementPdf.output('datauristring');
        expect(outlineElementStr.length).toBeGreaterThan(100);

        // Test the normal version of the same banner for comparison
        const normalElementPdf = BannerPDFGenerator.generatePDF(testBanner, {
            download: false,
            inkSaverMode: false
        });
        const normalElementStr = normalElementPdf.output('datauristring');

        // Element-level outline should create different content than normal
        expect(outlineElementStr).not.toBe(normalElementStr);
    });

    it('should calculate element positioning correctly', () => {
        const banner = TemplateManager.createBannerFromTemplate('congratulations');

        // This test ensures PDF positioning logic doesn't crash
        const pdf = BannerPDFGenerator.generatePDF(banner, { download: false });

        expect(pdf).toBeDefined();
        // Verify the PDF contains content (check that it has reasonable size)
        const pdfArrayBuffer = pdf.output('arraybuffer');
        expect(pdfArrayBuffer.byteLength).toBeGreaterThan(1000); // Reasonable minimum for a PDF with content
    });
});
