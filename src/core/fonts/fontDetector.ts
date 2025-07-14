import { SystemFont, FontDetectionResult, SYSTEM_FONTS } from './types';

/**
 * Font detection utility for checking system font availability
 */
export class FontDetector {
    private static canvas?: HTMLCanvasElement;
    private static context?: CanvasRenderingContext2D;

    /**
     * Initialize canvas for font detection
     */
    private static initCanvas(): CanvasRenderingContext2D {
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.width = 100;
            this.canvas.height = 50;
        }

        if (!this.context) {
            const ctx = this.canvas.getContext('2d');
            if (!ctx) {
                throw new Error('Could not get canvas context for font detection');
            }
            this.context = ctx;
        }

        return this.context;
    }

    /**
     * Check if a specific font is available on the system
     */
    static isFontAvailable(fontFamily: string): boolean {
        if (typeof window === 'undefined') {
            // Server-side rendering - assume font is available
            return true;
        }

        try {
            const ctx = this.initCanvas();

            // Baseline text with fallback font
            const fallbackFont = '16px monospace';
            ctx.font = fallbackFont;
            const fallbackWidth = ctx.measureText('abcdefghijklmnopqrstuvwxyz').width;

            // Test text with target font
            const testFont = `16px "${fontFamily}", monospace`;
            ctx.font = testFont;
            const testWidth = ctx.measureText('abcdefghijklmnopqrstuvwxyz').width;

            // If widths differ, the font is likely available
            return Math.abs(testWidth - fallbackWidth) > 1;
        } catch (error) {
            console.warn(`Font detection failed for ${fontFamily}:`, error);
            return false;
        }
    }

    /**
     * Detect all available fonts from the system font list
     */
    static detectAvailableFonts(): FontDetectionResult {
        const available: SystemFont[] = [];
        const unavailable: SystemFont[] = [];
        const fallbackMap: Record<string, string> = {};

        for (const font of SYSTEM_FONTS) {
            const isAvailable = this.isFontAvailable(font.family);

            if (isAvailable) {
                available.push({ ...font, available: true });
            } else {
                unavailable.push({ ...font, available: false });

                // Find the first available fallback
                const availableFallback = font.fallbacks.find(fallback =>
                    this.isFontAvailable(fallback)
                );

                if (availableFallback) {
                    fallbackMap[font.family] = availableFallback;
                } else {
                    // Use generic fallback based on category
                    fallbackMap[font.family] = this.getGenericFallback(font.category);
                }
            }
        }

        return {
            available,
            unavailable,
            fallbackMap
        };
    }

    /**
     * Get a generic fallback font for a category
     */
    private static getGenericFallback(category: string): string {
        switch (category) {
            case 'serif':
                return 'serif';
            case 'sans-serif':
                return 'sans-serif';
            case 'display':
                return 'sans-serif';
            case 'handwriting':
                return 'cursive';
            case 'monospace':
                return 'monospace';
            default:
                return 'sans-serif';
        }
    }

    /**
     * Get the best available font for a given font family
     */
    static getBestAvailableFont(requestedFont: string): string {
        // Check if requested font is available
        if (this.isFontAvailable(requestedFont)) {
            return requestedFont;
        }

        // Find the font in our system list
        const systemFont = SYSTEM_FONTS.find(f => f.family === requestedFont);
        if (!systemFont) {
            return 'sans-serif'; // Ultimate fallback
        }

        // Try each fallback in order
        for (const fallback of systemFont.fallbacks) {
            if (this.isFontAvailable(fallback)) {
                return fallback;
            }
        }

        // Return generic fallback
        return this.getGenericFallback(systemFont.category);
    }

    /**
     * Create a complete font string with fallbacks
     */
    static createFontString(fontFamily: string, fontSize: number, weight = 'normal'): string {
        const bestFont = this.getBestAvailableFont(fontFamily);
        const systemFont = SYSTEM_FONTS.find(f => f.family === fontFamily);

        if (systemFont) {
            const fallbacks = systemFont.fallbacks.join(', ');
            return `${weight} ${fontSize}px "${bestFont}", ${fallbacks}`;
        }

        return `${weight} ${fontSize}px "${bestFont}"`;
    }
}

/**
 * Font utilities for the banner system
 */
export class FontUtils {
    /**
     * Get all fonts in a specific category that are available
     */
    static getFontsByCategory(category: string): SystemFont[] {
        return SYSTEM_FONTS
            .filter(font => font.category === category)
            .map(font => ({
                ...font,
                available: FontDetector.isFontAvailable(font.family)
            }));
    }

    /**
     * Get the most suitable fonts for banner text (prioritize readability and impact)
     */
    static getBannerRecommendedFonts(): SystemFont[] {
        const recommended = [
            'Impact',
            'Arial Black',
            'Franklin Gothic Medium',
            'Georgia',
            'Arial',
            'Verdana'
        ];

        return SYSTEM_FONTS
            .filter(font => recommended.includes(font.family))
            .map(font => ({
                ...font,
                available: FontDetector.isFontAvailable(font.family)
            }))
            .sort((a, b) => {
                // Sort by availability, then by recommendation order
                if (a.available && !b.available) return -1;
                if (!a.available && b.available) return 1;
                return recommended.indexOf(a.family) - recommended.indexOf(b.family);
            });
    }

    /**
     * Validate that a font family is safe to use
     */
    static validateFontFamily(fontFamily: string): boolean {
        return SYSTEM_FONTS.some(font => font.family === fontFamily) ||
            FontDetector.isFontAvailable(fontFamily);
    }
}
