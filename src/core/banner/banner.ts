import { Banner, BannerTextElement, DEFAULT_BANNER_CONFIG, BannerDimensions } from './types';
import { measureTextWidth } from './textMeasure';
import { DecorativeElements, BorderElement, EmojiElement, BORDER_STYLES } from '../decorative/types';

/**
 * Factory for creating new banners
 */
export class BannerFactory {
    static createEmptyBanner(title: string, dimensions?: BannerDimensions): Banner {
        const defaultDecorativeElements: DecorativeElements = {
            borders: [],
            emojis: []
        };

        return {
            id: this.generateId(),
            title,
            dimensions: dimensions || DEFAULT_BANNER_CONFIG.dimensions,
            pages: [{ pageNumber: 1, elements: [] }],
            backgroundColor: DEFAULT_BANNER_CONFIG.backgroundColor,
            inkSaverMode: DEFAULT_BANNER_CONFIG.inkSaverMode,
            decorative: defaultDecorativeElements,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    }

    static createBannerWithText(
        title: string,
        text: string,
        dimensions?: BannerDimensions
    ): Banner {
        const banner = this.createEmptyBanner(title, dimensions);

        // Calculate optimal font size and required pages
        const fontSize = this.calculateOptimalFontSize(text);
        const estimatedPages = this.estimateRequiredPages(text, fontSize);

        // Create all required pages
        for (let i = 2; i <= estimatedPages; i++) {
            banner.pages.push({ pageNumber: i, elements: [] });
        }

        // Create text element centered across the ENTIRE banner width
        const textElement: BannerTextElement = {
            id: this.generateId(),
            text,
            fontSize,
            fontFamily: 'Georgia',
            color: '#000000',
            x: 0.5, // Center across the TOTAL banner width (all pages combined)
            y: 0.5, // Center vertically 
            rotation: 0,
            outline: false,
        };

        // Add the text element to the first page
        // (The rendering logic will handle showing it across multiple pages)
        banner.pages[0].elements.push(textElement);

        return banner;
    }

    /**
     * Estimate how many landscape pages will be needed for the text
     * This is a rough estimate based on character count and font size
     * Note: fontSize should be the ACTUAL print size, not UI display size
     */
    private static estimateRequiredPages(text: string, fontSize: number): number {
        // Use CSS-based text measurement for accurate width estimation
        const fontFamily = 'Georgia';
        let widthPx = measureTextWidth(text, fontSize, fontFamily);
        
        // Add fudge factor (5% extra width)
        widthPx *= 1.05;
        
        // The CSS measurement gives us pixels at browser scale
        // For print calculations, we need to scale appropriately
        // At 96 DPI (browser), 11 inches = 1056 pixels
        const pageWidthPx = 11 * 96; // 1056px per landscape page
        
        const pagesNeeded = Math.ceil(widthPx / pageWidthPx);
        
        return Math.max(1, Math.min(pagesNeeded, 6));
    }

    /**
     * Calculate optimal font size for banner text
     * Returns actual PRINT font sizes (not UI display sizes)
     * Longer text gets smaller fonts, shorter text gets larger fonts
     */
    private static calculateOptimalFontSize(text: string): number {
        const charCount = text.length;

        // Font sizes are now ACTUAL print sizes (what will appear on paper)
        // UI will scale these down for display
        if (charCount <= 6) {
            return 450; // Very large for short text like "HOME!" (was 150 * 3)
        } else if (charCount <= 12) {
            return 360; // Large for medium text like "WELCOME HOME" (was 120 * 3)
        } else if (charCount <= 20) {
            return 300; // Medium-large for "CONGRATULATIONS!" (was 100 * 3)
        } else if (charCount <= 35) {
            return 240; // Medium for "CONGRATULATIONS ON YOUR NEW JOB!" (was 80 * 3)
        } else {
            return 180; // Smaller for very long text (was 60 * 3)
        }
    }

    private static generateId(): string {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}

/**
 * Banner manipulation utilities
 */
export class BannerUtils {
    static addTextElement(banner: Banner, text: string, pageNumber = 1): Banner {
        const updatedBanner = { ...banner };

        // Calculate optimal font size for the new text
        const optimalFontSize = BannerFactory['calculateOptimalFontSize'](text);

        const textElement: BannerTextElement = {
            id: BannerFactory['generateId'](),
            text,
            fontSize: optimalFontSize,
            fontFamily: 'Georgia',
            color: '#000000',
            x: 0.5,
            y: 0.5,
            rotation: 0,
            outline: banner.inkSaverMode,
        };

        // Ensure we have enough pages for this text
        const requiredPages = BannerFactory['estimateRequiredPages'](text, optimalFontSize);
        while (updatedBanner.pages.length < requiredPages) {
            const nextPageNumber = updatedBanner.pages.length + 1;
            updatedBanner.pages.push({
                pageNumber: nextPageNumber,
                elements: []
            });
        }

        // Add the text element to the specified page
        const page = updatedBanner.pages.find(p => p.pageNumber === pageNumber);
        if (!page) {
            throw new Error(`Page ${pageNumber} not found`);
        }

        page.elements.push(textElement);
        updatedBanner.updatedAt = new Date();

        return updatedBanner;
    }

    static updateTextElement(
        banner: Banner,
        elementId: string,
        updates: Partial<BannerTextElement>
    ): Banner {
        const updatedBanner = { ...banner };

        for (const page of updatedBanner.pages) {
            const elementIndex = page.elements.findIndex(el => el.id === elementId);
            if (elementIndex !== -1) {
                page.elements[elementIndex] = {
                    ...page.elements[elementIndex],
                    ...updates
                };
                updatedBanner.updatedAt = new Date();
                break;
            }
        }

        return updatedBanner;
    }

    static toggleInkSaverMode(banner: Banner): Banner {
        const updatedBanner = {
            ...banner,
            inkSaverMode: !banner.inkSaverMode,
            updatedAt: new Date()
        };

        // Update all text elements to reflect ink saver mode
        updatedBanner.pages.forEach(page => {
            page.elements.forEach(element => {
                element.outline = updatedBanner.inkSaverMode;
            });
        });

        return updatedBanner;
    }

    static calculateTotalPages(banner: Banner): number {
        return banner.pages.length;
    }

    static addPage(banner: Banner): Banner {
        const updatedBanner = { ...banner };
        const nextPageNumber = Math.max(...banner.pages.map(p => p.pageNumber)) + 1;

        updatedBanner.pages.push({
            pageNumber: nextPageNumber,
            elements: []
        });

        updatedBanner.updatedAt = new Date();
        return updatedBanner;
    }

    /**
     * Add a border element to the banner's decorative elements
     */
    static addBorder(banner: Banner, borderStyleId: string, position: BorderElement['position'] = 'all', margin = 0.5): Banner {
        const borderStyle = BORDER_STYLES.find(style => style.id === borderStyleId);
        if (!borderStyle) {
            throw new Error(`Border style with id "${borderStyleId}" not found`);
        }

        const borderElement: BorderElement = {
            id: BannerFactory['generateId'](),
            style: borderStyle,
            position,
            margin,
            enabled: true
        };

        const updatedBanner = {
            ...banner,
            decorative: {
                ...banner.decorative,
                borders: [...banner.decorative.borders, borderElement]
            },
            updatedAt: new Date()
        };

        return updatedBanner;
    }

    /**
     * Add an emoji element to the banner's decorative elements
     */
    static addEmoji(banner: Banner, emoji: string, x: number, y: number, size = 48, rotation = 0): Banner {
        const emojiElement: EmojiElement = {
            id: BannerFactory['generateId'](),
            emoji,
            x,
            y,
            size,
            rotation
        };

        const updatedBanner = {
            ...banner,
            decorative: {
                ...banner.decorative,
                emojis: [...banner.decorative.emojis, emojiElement]
            },
            updatedAt: new Date()
        };

        return updatedBanner;
    }

    /**
     * Update decorative elements for a banner
     */
    static updateDecorativeElements(banner: Banner, decorative: Partial<DecorativeElements>): Banner {
        return {
            ...banner,
            decorative: {
                ...banner.decorative,
                ...decorative
            },
            updatedAt: new Date()
        };
    }
}
