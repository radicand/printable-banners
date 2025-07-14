import { FontDetector } from '../fonts';

// Utility for measuring text width in the browser using canvas
export function measureTextWidth(text: string, fontSize: number, fontFamily: string): number {
    if (typeof window === 'undefined') return 0;

    const canvas = measureTextWidth._canvas || (measureTextWidth._canvas = document.createElement('canvas'));
    const ctx = canvas.getContext('2d');
    if (!ctx) return 0;

    // Use the best available font for accurate measurement
    const bestFont = FontDetector.getBestAvailableFont(fontFamily);
    const fontString = FontDetector.createFontString(bestFont, fontSize);

    ctx.font = fontString;
    return ctx.measureText(text).width;
}

// For testability
measureTextWidth._canvas = undefined as HTMLCanvasElement | undefined;
