import { describe, it, expect } from 'bun:test';
import { BannerPDFGenerator } from '../../src/core/pdf';
import { TemplateManager } from '../../src/core/template';

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
