/**
 * Tests for decorative elements (borders and emojis)
 */

import { describe, expect, it } from 'bun:test';
import {
    BORDER_STYLES,
    EMOJI_CATEGORIES,
    calculateBorderPaths,
    createDefaultBorder,
    EmojiElement
} from '../../src/core/decorative';
import { BannerDimensions } from '../../src/core/banner';

describe('Border Styles', () => {
    it('should have predefined border styles', () => {
        expect(BORDER_STYLES.length).toBeGreaterThan(0);

        // Check that we have different types of borders
        const types = BORDER_STYLES.map(s => s.type);
        expect(types).toContain('solid');
        expect(types).toContain('dashed');
        expect(types).toContain('dotted');
        expect(types).toContain('emoji');
    });

    it('should have all required properties for each border style', () => {
        BORDER_STYLES.forEach(style => {
            expect(style.id).toBeDefined();
            expect(style.name).toBeDefined();
            expect(style.description).toBeDefined();
            expect(style.type).toBeDefined();

            if (style.type === 'emoji') {
                expect(style.emoji).toBeDefined();
                expect(style.spacing).toBeDefined();
            }

            if (style.type !== 'emoji') {
                expect(style.color).toBeDefined();
            }
        });
    });
});

describe('Emoji Categories', () => {
    it('should have emoji categories with valid emojis', () => {
        const categories = Object.keys(EMOJI_CATEGORIES);
        expect(categories.length).toBeGreaterThan(0);

        // Check some expected categories
        expect(categories).toContain('celebration');
        expect(categories).toContain('hearts');
        expect(categories).toContain('nature');

        // Each category should have emojis
        categories.forEach(category => {
            const emojis = EMOJI_CATEGORIES[category as keyof typeof EMOJI_CATEGORIES];
            expect(emojis.length).toBeGreaterThan(0);

            // Each emoji should be a string
            emojis.forEach(emoji => {
                expect(typeof emoji).toBe('string');
                expect(emoji.length).toBeGreaterThan(0);
            });
        });
    });
});

describe('Border Calculations', () => {
    const testDimensions: BannerDimensions = {
        width: 11,
        height: 8.5,
        unit: 'in'
    };

    it('should calculate border paths for solid borders', () => {
        const border = createDefaultBorder('solid-thin');
        border.style = BORDER_STYLES.find(s => s.id === 'solid-thin')!;

        const paths = calculateBorderPaths(border, {
            dimensions: testDimensions,
            inkSaverMode: false
        });

        expect(paths.length).toBe(4); // All four sides
        paths.forEach(path => {
            expect(path.type).toBe('line');
            expect(path.color).toBeDefined();
            expect(path.thickness).toBeDefined();
        });
    });

    it('should calculate border paths for emoji borders', () => {
        const border = createDefaultBorder('star-pattern');
        border.style = BORDER_STYLES.find(s => s.id === 'star-pattern')!;

        const paths = calculateBorderPaths(border, {
            dimensions: testDimensions,
            inkSaverMode: false
        });

        expect(paths.length).toBeGreaterThan(0);
        paths.forEach(path => {
            expect(path.type).toBe('emoji');
            expect(path.emoji).toBe('⭐');
        });
    });

    it('should handle different border positions', () => {
        const border = createDefaultBorder('solid-thin');
        border.style = BORDER_STYLES.find(s => s.id === 'solid-thin')!;
        border.position = 'top';

        const paths = calculateBorderPaths(border, {
            dimensions: testDimensions,
            inkSaverMode: false
        });

        expect(paths.length).toBe(1); // Only top border
    });
});

describe('Decorative Element Creation', () => {
    it('should create default border with valid properties', () => {
        const border = createDefaultBorder('solid-thin');

        expect(border.id).toBeDefined();
        expect(border.position).toBe('all');
        expect(border.margin).toBe(0.25);
        expect(border.enabled).toBe(true);
    });

    it('should create emoji element with valid properties', () => {
        const emoji: EmojiElement = {
            id: 'test-emoji',
            emoji: '🎉',
            x: 50,
            y: 25,
            size: 24,
            rotation: 0
        };

        expect(emoji.emoji).toBe('🎉');
        expect(emoji.x).toBe(50);
        expect(emoji.y).toBe(25);
        expect(emoji.size).toBe(24);
        expect(emoji.rotation).toBe(0);
    });
});
