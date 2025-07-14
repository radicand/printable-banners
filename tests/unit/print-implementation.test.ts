import { describe, expect, it } from 'bun:test';
import { BannerFactory } from '../../src/core/banner';

// Simulate print positioning for a large text element across multiple pages
function getVisibleTextSpanOnPage({ x, fontSize, text }: { x: number; fontSize: number; text: string }, pageIndex: number, totalPages: number, pageWidthPx: number) {
    // Calculate total banner width in px
    const totalBannerWidth = pageWidthPx * totalPages;
    const absoluteX = x * totalBannerWidth;
    const textWidth = fontSize * text.length * 0.6;
    const textStart = absoluteX - textWidth / 2;
    const textEnd = absoluteX + textWidth / 2;
    // Page bounds
    const pageStart = pageIndex * pageWidthPx;
    const pageEnd = (pageIndex + 1) * pageWidthPx;
    // Visible span is the intersection
    const visibleStart = Math.max(textStart, pageStart);
    const visibleEnd = Math.min(textEnd, pageEnd);
    if (visibleEnd <= visibleStart) return null;
    return { start: visibleStart, end: visibleEnd };
}

// Note: Print implementation tests that require browser APIs for text measurement
// are covered by E2E tests in tests/e2e/print-pagination.spec.ts
