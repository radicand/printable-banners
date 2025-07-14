import { describe, it, expect } from 'bun:test';
import { FontUtils, SYSTEM_FONTS, FONT_CATEGORIES } from '../../src/core/fonts';

describe('FontUtils', () => {
    it('should get fonts by category', () => {
        const serifFonts = FontUtils.getFontsByCategory('serif');
        expect(Array.isArray(serifFonts)).toBe(true);
        serifFonts.forEach(font => {
            expect(font.category).toBe('serif');
            expect(font).toHaveProperty('available');
        });
    });

    it('should get banner recommended fonts', () => {
        const recommended = FontUtils.getBannerRecommendedFonts();
        expect(Array.isArray(recommended)).toBe(true);
        expect(recommended.length).toBeGreaterThan(0);

        // Should include Impact and Arial Black as high priority
        const fontNames = recommended.map(f => f.family);
        expect(fontNames).toContain('Impact');
        expect(fontNames).toContain('Arial Black');
    });

    it('should validate known font families', () => {
        expect(FontUtils.validateFontFamily('Arial')).toBe(true);
        expect(FontUtils.validateFontFamily('Georgia')).toBe(true);
        expect(FontUtils.validateFontFamily('Impact')).toBe(true);
    });
});

describe('SYSTEM_FONTS data', () => {
    it('should have all required properties for each font', () => {
        SYSTEM_FONTS.forEach(font => {
            expect(font).toHaveProperty('name');
            expect(font).toHaveProperty('family');
            expect(font).toHaveProperty('fallbacks');
            expect(font).toHaveProperty('category');
            expect(font).toHaveProperty('weight');
            expect(font).toHaveProperty('style');

            expect(typeof font.name).toBe('string');
            expect(typeof font.family).toBe('string');
            expect(Array.isArray(font.fallbacks)).toBe(true);
            expect(['serif', 'sans-serif', 'display', 'handwriting', 'monospace']).toContain(font.category);
        });
    });

    it('should have fonts in each category', () => {
        const categories = ['serif', 'sans-serif', 'display', 'handwriting', 'monospace'];

        categories.forEach(category => {
            const fontsInCategory = SYSTEM_FONTS.filter(f => f.category === category);
            expect(fontsInCategory.length).toBeGreaterThan(0);
        });
    });

    it('should have at least 15 fonts total', () => {
        expect(SYSTEM_FONTS.length).toBeGreaterThanOrEqual(15);
    });
});

describe('FONT_CATEGORIES data', () => {
    it('should have all required properties', () => {
        FONT_CATEGORIES.forEach(category => {
            expect(category).toHaveProperty('id');
            expect(category).toHaveProperty('name');
            expect(category).toHaveProperty('description');
            expect(category).toHaveProperty('fonts');

            expect(typeof category.id).toBe('string');
            expect(typeof category.name).toBe('string');
            expect(typeof category.description).toBe('string');
            expect(Array.isArray(category.fonts)).toBe(true);
        });
    });

    it('should correctly categorize fonts', () => {
        FONT_CATEGORIES.forEach(category => {
            category.fonts.forEach(font => {
                expect(font.category).toBe(category.id);
            });
        });
    });

    it('should have 5 main categories', () => {
        expect(FONT_CATEGORIES).toHaveLength(5);
        const expectedCategories = ['serif', 'sans-serif', 'display', 'handwriting', 'monospace'];
        const actualCategories = FONT_CATEGORIES.map(c => c.id);
        expectedCategories.forEach(cat => {
            expect(actualCategories).toContain(cat);
        });
    });
});
