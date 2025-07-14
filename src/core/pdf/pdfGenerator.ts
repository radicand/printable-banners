import jsPDF from 'jspdf';
import { Banner, BannerTextElement } from '../banner';
import { measureTextWidth } from '../banner/textMeasure';

export interface PDFGenerationOptions {
    filename?: string;
    download?: boolean;
    inkSaverMode?: boolean;
}

export class BannerPDFGenerator {
    private static readonly PAGE_WIDTH_IN = 11;
    private static readonly PAGE_HEIGHT_IN = 8.5;
    private static readonly DPI = 72; // jsPDF uses 72 DPI
    private static readonly PAGE_WIDTH_PT = BannerPDFGenerator.PAGE_WIDTH_IN * BannerPDFGenerator.DPI;
    private static readonly PAGE_HEIGHT_PT = BannerPDFGenerator.PAGE_HEIGHT_IN * BannerPDFGenerator.DPI;

    /**
     * Generate a PDF for the banner with precise text positioning
     */
    static generatePDF(banner: Banner, options: PDFGenerationOptions = {}): jsPDF {
        const {
            filename = `${banner.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
            download = true,
            inkSaverMode = banner.inkSaverMode
        } = options;

        // Create PDF with landscape orientation
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'pt',
            format: [BannerPDFGenerator.PAGE_WIDTH_PT, BannerPDFGenerator.PAGE_HEIGHT_PT]
        });

        // Generate each page
        banner.pages.forEach((_, pageIndex) => {
            if (pageIndex > 0) {
                pdf.addPage();
            }

            // Add page elements
            this.addPageElements(pdf, banner, pageIndex, inkSaverMode);
        });

        // Download or return the PDF
        if (download) {
            pdf.save(filename);
        }

        return pdf;
    }

    /**
     * Add all text elements for a specific page with accurate positioning
     */
    private static addPageElements(
        pdf: jsPDF,
        banner: Banner,
        pageIndex: number,
        inkSaverMode: boolean
    ): void {
        const allElements = banner.pages.flatMap(p => p.elements);

        allElements.forEach(element => {
            const positionedElement = this.calculateElementForPage(element, pageIndex, banner.pages.length);
            if (positionedElement) {
                this.addTextElement(pdf, positionedElement, inkSaverMode);
            }
        });
    }

    /**
     * Calculate if and how a text element should appear on a specific page
     */
    private static calculateElementForPage(
        element: BannerTextElement,
        pageIndex: number,
        totalPages: number
    ): (BannerTextElement & { relativeX: number }) | null {
        // Calculate position based on the ENTIRE banner width (across all pages)
        const totalBannerWidth = BannerPDFGenerator.PAGE_WIDTH_PT * totalPages;
        const absoluteX = element.x * totalBannerWidth;

        // Calculate position relative to THIS page
        const pageStartX = pageIndex * BannerPDFGenerator.PAGE_WIDTH_PT;
        const relativeX = absoluteX - pageStartX;

        // Get accurate text width using canvas measurement
        const textWidth = measureTextWidth(element.text, element.fontSize, element.fontFamily);

        // Convert text width from canvas pixels to PDF points (roughly 1:1 ratio at 72 DPI)
        const textWidthPt = textWidth * 0.75; // Approximate conversion factor

        // Calculate text boundaries
        const textStart = relativeX - textWidthPt / 2;
        const textEnd = relativeX + textWidthPt / 2;

        // Check if any part of the text is visible on this page
        const pageStart = 0;
        const pageEnd = BannerPDFGenerator.PAGE_WIDTH_PT;

        // Use a small margin for edge cases
        const margin = 10;
        if (textEnd < pageStart - margin || textStart > pageEnd + margin) {
            return null; // Text doesn't appear on this page
        }

        return {
            ...element,
            relativeX
        };
    }

    /**
     * Add a single text element to the PDF with proper styling
     */
    private static addTextElement(
        pdf: jsPDF,
        element: BannerTextElement & { relativeX: number },
        inkSaverMode: boolean
    ): void {
        // Set font properties
        pdf.setFont(this.mapFontFamily(element.fontFamily));
        pdf.setFontSize(element.fontSize * 0.75); // Convert from CSS pixels to PDF points

        // Calculate Y position (PDF coordinate system has origin at top-left)
        const y = element.y * BannerPDFGenerator.PAGE_HEIGHT_PT;

        // Handle ink saver mode (outline text)
        if (inkSaverMode || element.outline) {
            // Draw outlined text
            pdf.setTextColor(255, 255, 255); // White fill
            const [r, g, b] = this.hexToRgb(element.color);
            pdf.setDrawColor(r, g, b); // Colored outline
            pdf.setLineWidth(1);

            // jsPDF doesn't have native outline text, so we'll simulate it
            // by drawing the text multiple times with slight offsets
            const outlineOffsets = [
                [-0.5, -0.5], [0, -0.5], [0.5, -0.5],
                [-0.5, 0], [0.5, 0],
                [-0.5, 0.5], [0, 0.5], [0.5, 0.5]
            ];

            const [tr, tg, tb] = this.hexToRgb(element.color);
            pdf.setTextColor(tr, tg, tb);
            outlineOffsets.forEach(([dx, dy]) => {
                pdf.text(element.text, element.relativeX + dx, y + dy, {
                    align: 'center',
                    angle: element.rotation
                });
            });
        } else {
            // Draw solid text
            const [r, g, b] = this.hexToRgb(element.color);
            pdf.setTextColor(r, g, b);
            pdf.text(element.text, element.relativeX, y, {
                align: 'center',
                angle: element.rotation
            });
        }
    }

    /**
     * Map CSS font families to jsPDF font names
     */
    private static mapFontFamily(fontFamily: string): string {
        const fontMap: Record<string, string> = {
            'Georgia': 'times',
            'Times New Roman': 'times',
            'Arial': 'helvetica',
            'Helvetica': 'helvetica',
            'Impact': 'helvetica' // Fallback since Impact isn't available
        };

        return fontMap[fontFamily] || 'helvetica';
    }

    /**
     * Convert hex color to RGB values for jsPDF
     */
    private static hexToRgb(hex: string): [number, number, number] {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (result) {
            return [
                parseInt(result[1], 16),
                parseInt(result[2], 16),
                parseInt(result[3], 16)
            ];
        }
        return [0, 0, 0]; // Default to black
    }

    /**
     * Preview the PDF as a blob URL for viewing before download
     */
    static generatePreviewUrl(banner: Banner, options: PDFGenerationOptions = {}): string {
        const pdf = this.generatePDF(banner, { ...options, download: false });
        const blob = pdf.output('blob');
        return URL.createObjectURL(blob);
    }

    /**
     * Get PDF as Uint8Array for advanced use cases
     */
    static generatePDFBuffer(banner: Banner, options: PDFGenerationOptions = {}): Uint8Array {
        const pdf = this.generatePDF(banner, { ...options, download: false });
        const arrayBuffer = pdf.output('arraybuffer');
        return new Uint8Array(arrayBuffer);
    }
}
