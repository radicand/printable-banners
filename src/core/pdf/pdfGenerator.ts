import jsPDF from 'jspdf';
import { Banner, BannerTextElement } from '../banner';
import { SYSTEM_FONTS } from '../fonts';
import { measureTextWidth } from '../banner/textMeasure';
import { calculateBorderPaths, BorderPath, BorderElement } from '../decorative';

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
        // Add page-specific decorative elements (only individual emojis and page-specific borders)
        this.addPageDecorativeElements(pdf, banner, pageIndex, inkSaverMode);

        // Add text elements
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
            // Set text rendering mode to stroke-only (1 = stroke text)
            const [r, g, b] = this.hexToRgb(element.color);
            pdf.setDrawColor(r, g, b); // Set stroke color
            pdf.setLineWidth(0.5); // Thin outline

            // Set text rendering mode to stroke-only using PDF operator
            (pdf as any).internal.out('1 Tr'); // 1 = stroke text rendering mode

            // Draw the text (will be stroked because of rendering mode)
            pdf.text(element.text, element.relativeX, y, {
                align: 'center',
                angle: element.rotation
            });

            // Reset text rendering mode to fill (0 = fill text)
            (pdf as any).internal.out('0 Tr');
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
     * Map CSS font families to jsPDF font names with improved mapping
     */
    private static mapFontFamily(fontFamily: string): string {
        const fontMap: Record<string, string> = {
            // Serif fonts
            'Georgia': 'times',
            'Times New Roman': 'times',
            'Book Antiqua': 'times',
            'Palatino': 'times',

            // Sans-serif fonts
            'Arial': 'helvetica',
            'Helvetica': 'helvetica',
            'Verdana': 'helvetica',
            'Tahoma': 'helvetica',
            'Trebuchet MS': 'helvetica',
            'Calibri': 'helvetica',

            // Display fonts
            'Impact': 'helvetica',
            'Arial Black': 'helvetica',
            'Franklin Gothic Medium': 'helvetica',

            // Handwriting fonts
            'Brush Script MT': 'helvetica',
            'Comic Sans MS': 'helvetica',

            // Monospace fonts
            'Courier New': 'courier',
            'Lucida Console': 'courier'
        };

        // If we have a mapping, use it
        if (fontMap[fontFamily]) {
            return fontMap[fontFamily];
        }

        // Try to find a system font that matches
        const systemFont = SYSTEM_FONTS.find(f => f.family === fontFamily);
        if (systemFont) {
            switch (systemFont.category) {
                case 'serif':
                    return 'times';
                case 'monospace':
                    return 'courier';
                default:
                    return 'helvetica';
            }
        }

        // Default fallback
        return 'helvetica';
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

    /**
     * Add decorative elements for a specific page (emojis and page-specific borders)
     */
    private static addPageDecorativeElements(
        pdf: jsPDF,
        banner: Banner,
        pageIndex: number,
        _inkSaverMode: boolean
    ): void {
        // Add borders that are specific to this page's position in the banner
        banner.decorative.borders
            .filter(border => border.enabled)
            .forEach(border => {
                const paths = this.calculateBorderPathsForPage(border, banner, pageIndex);
                paths.forEach(path => this.renderBorderPath(pdf, path));
            });

        // Add individual emojis (position them correctly for multi-page banners)
        banner.decorative.emojis.forEach(emoji => {
            this.addEmojiElementToPages(pdf, emoji, banner, pageIndex);
        });
    }

    /**
     * Calculate border paths for a specific page in a multi-page banner
     */
    private static calculateBorderPathsForPage(
        border: BorderElement,
        banner: Banner,
        pageIndex: number
    ): BorderPath[] {
        const totalPages = banner.pages.length;
        const isFirstPage = pageIndex === 0;
        const isLastPage = pageIndex === totalPages - 1;

        // For single page banners, show all borders
        if (totalPages === 1) {
            return calculateBorderPaths(border, {
                dimensions: banner.dimensions,
                inkSaverMode: banner.inkSaverMode
            });
        }

        // For multi-page banners, only show appropriate borders
        const paths: BorderPath[] = [];
        const { style } = border;

        // Convert dimensions to pixels (assuming 72 DPI)
        const width = banner.dimensions.unit === 'in' ? banner.dimensions.width * 72 : banner.dimensions.width;
        const height = banner.dimensions.unit === 'in' ? banner.dimensions.height * 72 : banner.dimensions.height;
        // Convert margin from inches to points/pixels
        const fullMarginPx = banner.dimensions.unit === 'in' ? border.margin * 72 : border.margin;

        // Top borders: Show on all pages
        if (border.position === 'top' || border.position === 'all') {
            // Always use full margin for top borders
            const topMargin = fullMarginPx;
            paths.push(...this.createBorderPathsForPosition(style, width, height, topMargin, 'top', pageIndex, totalPages));
        }

        // Bottom borders: Show on all pages  
        if (border.position === 'bottom' || border.position === 'all') {
            // Always use full margin for bottom borders
            const bottomMargin = fullMarginPx;
            paths.push(...this.createBorderPathsForPosition(style, width, height, bottomMargin, 'bottom', pageIndex, totalPages));
        }

        // Left border: Only show on first page
        if ((border.position === 'left' || border.position === 'all') && isFirstPage) {
            paths.push(...this.createBorderPathsForPosition(style, width, height, fullMarginPx, 'left', pageIndex, totalPages));
        }

        // Right border: Only show on last page  
        if ((border.position === 'right' || border.position === 'all') && isLastPage) {
            paths.push(...this.createBorderPathsForPosition(style, width, height, fullMarginPx, 'right', pageIndex, totalPages));
        }

        return paths;
    }

    /**
     * Create border paths for a specific position
     */
    private static createBorderPathsForPosition(
        style: BorderElement['style'],
        width: number,
        height: number,
        margin: number,
        position: 'top' | 'bottom' | 'left' | 'right',
        pageIndex: number = 0,
        totalPages: number = 1
    ): BorderPath[] {
        if (style.type === 'emoji' && style.emoji) {
            return this.createEmojiBorderPaths(style, width, height, margin, position, pageIndex, totalPages);
        } else {
            return this.createLineBorderPaths(style, width, height, margin, position);
        }
    }

    /**
     * Create line-based border paths
     */
    private static createLineBorderPaths(
        style: BorderElement['style'],
        width: number,
        height: number,
        margin: number,
        position: 'top' | 'bottom' | 'left' | 'right'
    ): BorderPath[] {
        const dashArray = style.type === 'dashed' ? [5, 5] :
            style.type === 'dotted' ? [2, 3] : undefined;

        switch (position) {
            case 'top':
                return [{
                    type: 'line',
                    x1: margin,
                    y1: margin,
                    x2: width - margin,
                    y2: margin,
                    color: style.color || '#000000',
                    thickness: style.thickness || 1,
                    dashArray
                }];
            case 'bottom':
                return [{
                    type: 'line',
                    x1: margin,
                    y1: height - margin,
                    x2: width - margin,
                    y2: height - margin,
                    color: style.color || '#000000',
                    thickness: style.thickness || 1,
                    dashArray
                }];
            case 'left':
                return [{
                    type: 'line',
                    x1: margin,
                    y1: margin,
                    x2: margin,
                    y2: height - margin,
                    color: style.color || '#000000',
                    thickness: style.thickness || 1,
                    dashArray
                }];
            case 'right':
                return [{
                    type: 'line',
                    x1: width - margin,
                    y1: margin,
                    x2: width - margin,
                    y2: height - margin,
                    color: style.color || '#000000',
                    thickness: style.thickness || 1,
                    dashArray
                }];
            default:
                return [];
        }
    }

    /**
     * Create emoji-based border paths with enhanced PDF support
     */
    private static createEmojiBorderPaths(
        style: BorderElement['style'],
        width: number,
        height: number,
        margin: number,
        position: 'top' | 'bottom' | 'left' | 'right',
        pageIndex: number = 0,
        totalPages: number = 1
    ): BorderPath[] {
        const paths: BorderPath[] = [];

        if (!style.emoji || !style.spacing) return paths;

        const spacing = style.spacing;
        const size = 16; // Default emoji size

        // Try to render emoji as image for better PDF compatibility
        const emojiImageData = this.renderEmojiAsImage(style.emoji, size);

        // For multi-page banners, determine if we need to respect left/right margins
        const isFirstPage = pageIndex === 0;
        const isLastPage = pageIndex === totalPages - 1;
        const isMultiPage = totalPages > 1;

        switch (position) {
            case 'top': {
                // For multi-page banners, respect margins on first/last pages for left/right edges
                let startX = 0;
                let endX = width;

                if (isMultiPage) {
                    // On first page, respect left margin
                    if (isFirstPage) {
                        startX = margin;
                    }
                    // On last page, respect right margin  
                    if (isLastPage) {
                        endX = width - margin;
                    }
                } else {
                    // Single page: respect both margins
                    startX = margin;
                    endX = width - margin;
                }

                const topCount = Math.floor((endX - startX) / spacing);
                for (let i = 0; i < topCount; i++) {
                    if (emojiImageData) {
                        paths.push({
                            type: 'image',
                            dataUrl: emojiImageData,
                            x: startX + (i * spacing) - (size / 2), // Center horizontally
                            y: margin - (size / 2), // Center vertically at margin
                            width: size,
                            height: size
                        });
                    } else {
                        // Fallback to symbol - adjust positioning for text baseline
                        paths.push({
                            type: 'emoji',
                            emoji: this.mapEmojiForPDF(style.emoji),
                            x: startX + (i * spacing) + (size / 2), // Center horizontally
                            y: margin + (size * 0.75), // Adjust for text baseline
                            size
                        });
                    }
                }
                break;
            }
            case 'bottom': {
                // For multi-page banners, respect margins on first/last pages for left/right edges
                let startX = 0;
                let endX = width;

                if (isMultiPage) {
                    // On first page, respect left margin
                    if (isFirstPage) {
                        startX = margin;
                    }
                    // On last page, respect right margin  
                    if (isLastPage) {
                        endX = width - margin;
                    }
                } else {
                    // Single page: respect both margins
                    startX = margin;
                    endX = width - margin;
                }

                const bottomCount = Math.floor((endX - startX) / spacing);
                for (let i = 0; i < bottomCount; i++) {
                    if (emojiImageData) {
                        paths.push({
                            type: 'image',
                            dataUrl: emojiImageData,
                            x: startX + (i * spacing) - (size / 2), // Center horizontally
                            y: height - margin - (size / 2), // Center vertically at margin
                            width: size,
                            height: size
                        });
                    } else {
                        paths.push({
                            type: 'emoji',
                            emoji: this.mapEmojiForPDF(style.emoji),
                            x: startX + (i * spacing) + (size / 2), // Center horizontally  
                            y: height - margin - (size * 0.25), // Adjust for text baseline from bottom
                            size
                        });
                    }
                }
                break;
            }
            case 'left': {
                const leftCount = Math.floor((height - 2 * margin) / spacing);
                for (let i = 0; i < leftCount; i++) {
                    if (emojiImageData) {
                        paths.push({
                            type: 'image',
                            dataUrl: emojiImageData,
                            x: margin - (size / 2), // Center horizontally
                            y: margin + (i * spacing) - (size / 2), // Center vertically
                            width: size,
                            height: size
                        });
                    } else {
                        paths.push({
                            type: 'emoji',
                            emoji: this.mapEmojiForPDF(style.emoji),
                            x: margin + (size / 2), // Center horizontally
                            y: margin + (i * spacing) + (size * 0.75), // Adjust for text baseline
                            size
                        });
                    }
                }
                break;
            }
            case 'right': {
                const rightCount = Math.floor((height - 2 * margin) / spacing);
                for (let i = 0; i < rightCount; i++) {
                    if (emojiImageData) {
                        paths.push({
                            type: 'image',
                            dataUrl: emojiImageData,
                            x: width - margin - (size / 2), // Center horizontally
                            y: margin + (i * spacing) - (size / 2), // Center vertically
                            width: size,
                            height: size
                        });
                    } else {
                        paths.push({
                            type: 'emoji',
                            emoji: this.mapEmojiForPDF(style.emoji),
                            x: width - margin - (size / 2), // Center horizontally from right
                            y: margin + (i * spacing) + (size * 0.75), // Adjust for text baseline
                            size
                        });
                    }
                }
                break;
            }
        }

        return paths;
    }

    /**
     * Render emoji as image data URL for better PDF compatibility
     */
    private static renderEmojiAsImage(emoji: string, size: number): string | null {
        try {
            // Create a high-resolution canvas for crisp emoji rendering (browser environment only)
            if (typeof document === 'undefined') {
                return null; // Test environment or server-side
            }

            const padding = 4 * (size / 12.5); // Add extra pixels to bottom and right
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return null;

            const pixelRatio = 4; // Higher resolution for better quality
            canvas.width = (size + padding) * pixelRatio;
            canvas.height = (size + padding) * pixelRatio;

            // Set up high-quality rendering - check if scale method exists (test environment compatibility)
            if (typeof ctx.scale === 'function') {
                ctx.scale(pixelRatio, pixelRatio);
            }
            ctx.font = `${size}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            // Clear background (transparent)
            ctx.clearRect(0, 0, size + padding, size + padding);

            // Render emoji, shifted to keep it visually centered
            ctx.fillText(emoji, (size / 2) + (padding / 2), (size / 2) + (padding / 2));

            // Convert to data URL
            return canvas.toDataURL('image/png');
        } catch (error) {
            console.warn('Failed to render emoji as image:', error);
            return null;
        }
    }

    /**
     * Render a single border path to the PDF
     */
    private static renderBorderPath(pdf: jsPDF, path: BorderPath): void {
        if (path.type === 'image' && path.dataUrl && path.width && path.height) {
            // Render emoji as image for better quality
            try {
                pdf.addImage(
                    path.dataUrl,
                    'PNG',
                    path.x || 0,
                    path.y || 0,
                    path.width,
                    path.height
                );
            } catch (error) {
                console.warn('Failed to add emoji image to PDF, falling back to symbol:', error);
                // Fallback to symbol rendering
                if (path.emoji) {
                    const pdfSymbol = this.mapEmojiForPDF(path.emoji);
                    pdf.setFont('helvetica');
                    pdf.setFontSize(path.size || 16);
                    pdf.setTextColor(0, 0, 0);
                    pdf.text(pdfSymbol, path.x || 0, path.y || 0, {
                        align: 'center'
                    });
                }
            }
        } else if (path.type === 'emoji' && path.emoji) {
            // Convert emoji to PDF-safe symbol
            const pdfSymbol = this.mapEmojiForPDF(path.emoji);

            // Set font for symbol rendering
            pdf.setFont('helvetica');
            pdf.setFontSize(path.size || 16);
            pdf.setTextColor(0, 0, 0);

            pdf.text(pdfSymbol, path.x || 0, path.y || 0, {
                align: 'center'
            });
        } else if (path.type === 'line' && path.x1 !== undefined) {
            // Set line properties
            const [r, g, b] = this.hexToRgb(path.color || '#000000');
            pdf.setDrawColor(r, g, b);
            pdf.setLineWidth(path.thickness || 1);

            // Handle dashed/dotted lines
            if (path.dashArray) {
                pdf.setLineDashPattern(path.dashArray, 0);
            } else {
                pdf.setLineDashPattern([], 0); // Solid line
            }

            // Draw the line
            pdf.line(path.x1, path.y1!, path.x2!, path.y2!);
        }
    }

    /**
     * Add an individual emoji element to the correct page in a multi-page banner
     */
    private static addEmojiElementToPages(
        pdf: jsPDF,
        emoji: { emoji: string; x: number; y: number; size: number; rotation: number },
        banner: Banner,
        currentPageIndex: number
    ): void {
        const totalPages = banner.pages.length;

        // For single page banners, add emoji directly
        if (totalPages === 1) {
            this.addEmojiElementToPage(pdf, emoji);
            return;
        }

        // Calculate which page this emoji should appear on based on its x position
        // x is 0-1 across the entire banner width
        const emojiPageIndex = Math.floor(emoji.x * totalPages);
        const clampedPageIndex = Math.max(0, Math.min(emojiPageIndex, totalPages - 1));

        // Only add emoji if we're currently rendering the correct page
        if (currentPageIndex === clampedPageIndex) {
            // Calculate the emoji's position within this specific page
            const pageLocalX = (emoji.x * totalPages) - clampedPageIndex;
            const localEmoji = {
                ...emoji,
                x: pageLocalX // Convert to page-local coordinates (0-1)
            };

            this.addEmojiElementToPage(pdf, localEmoji);
        }
    }

    /**
     * Add an individual emoji element to the current page
     */
    private static addEmojiElementToPage(pdf: jsPDF, emoji: { emoji: string; x: number; y: number; size: number; rotation: number }): void {
        // Try to render emoji as image first
        const imageData = this.renderEmojiAsImage(emoji.emoji, emoji.size);

        if (imageData) {
            // Convert position from 0-1 to points
            const x = emoji.x * BannerPDFGenerator.PAGE_WIDTH_PT;
            const y = emoji.y * BannerPDFGenerator.PAGE_HEIGHT_PT;

            // Calculate size in points (emoji.size is in pixels, convert to points)
            const sizeInPoints = emoji.size * 0.75; // 1px = 0.75pt at 96 DPI

            try {
                pdf.addImage(imageData, 'PNG',
                    x - sizeInPoints / 2, // Center horizontally
                    y - sizeInPoints / 1.5, // Adjust vertical positioning similar to borders
                    sizeInPoints,
                    sizeInPoints,
                    undefined,
                    'FAST'
                );
                return;
            } catch (error) {
                console.warn('Failed to add emoji image to PDF:', error);
            }
        }

        // Fallback to symbol rendering
        const pdfSymbol = this.mapEmojiForPDF(emoji.emoji);
        pdf.setFont('helvetica');
        pdf.setFontSize(emoji.size);
        pdf.setTextColor(0, 0, 0);

        // Convert position from 0-1 to points
        const x = emoji.x * BannerPDFGenerator.PAGE_WIDTH_PT;
        const y = emoji.y * BannerPDFGenerator.PAGE_HEIGHT_PT;

        pdf.text(pdfSymbol, x, y, {
            align: 'center',
            angle: emoji.rotation
        });
    }

    /**
     * Map emojis to PDF-safe symbols for border rendering
     */
    private static mapEmojiForPDF(emoji: string): string {
        const emojiMap: Record<string, string> = {
            '⭐': '*',
            '❤️': '♥',
            '🌸': '❀',
            '🌺': '❀',
            '🌻': '❀',
            '🌹': '❀',
            '🌷': '❀',
            '🎉': '♪',
            '🎊': '♪',
            '🎈': '○',
            '🎁': '■',
            '🍰': '♦',
            '🥳': '☺',
            '✨': '✦',
            '🌟': '★',
            '💖': '♥',
            '💕': '♥',
            '💗': '♥',
            '💙': '♥',
            '💚': '♥',
            '💛': '♥',
            '🧡': '♥',
            '🍀': '♣',
            '🌿': '♠',
            '🌱': '♠',
            '💫': '✦',
            '🌠': '✦',
            '⚡': '⚡',
            '☀️': '☀',
            '🌙': '☽'
        };

        return emojiMap[emoji] || '*'; // Default to asterisk
    }
}
