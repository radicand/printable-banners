import { describe, expect, test } from 'bun:test';
import { calculateDecorativeLayout, calculateBorderPaths } from '../../src/core/decorative';
import { DecorativeElements } from '../../src/core/decorative/types';
import { BannerDimensions } from '../../src/core/banner/types';

describe('Decorative Preview Logic', () => {
    const mockDimensions: BannerDimensions = {
        width: 11,
        height: 8.5,
        unit: 'in'
    };

    const mockDecorativeElements: DecorativeElements = {
        borders: [
            {
                id: 'border-1',
                style: {
                    id: 'heart-pattern',
                    name: 'Heart Border',
                    description: 'Repeating heart pattern',
                    type: 'emoji',
                    emoji: '❤️',
                    spacing: 25
                },
                position: 'all',
                margin: 0.3,
                enabled: true
            }
        ],
        emojis: [
            {
                id: 'emoji-1',
                emoji: '🎂',
                x: 0.15, // Should be interpreted as 15% not 0.15%
                y: 0.5,  // Should be interpreted as 50% not 0.5%
                size: 48,
                rotation: 0
            },
            {
                id: 'emoji-2',
                emoji: '🎈',
                x: 0.85, // Should be interpreted as 85% not 0.85%
                y: 0.25,
                size: 42,
                rotation: 0
            }
        ]
    };

    test('should calculate decorative layout for single page preview', () => {
        // Test the core calculateDecorativeLayout function
        const { emojis } = calculateDecorativeLayout({
            decorative: mockDecorativeElements,
            dimensions: mockDimensions,
            pageIndex: 0,
            totalPages: 1,
        });

        // Should return both emojis for single page
        expect(emojis.length).toBe(2);

        const cake = emojis.find(e => e.emoji === '🎂');
        const balloon = emojis.find(e => e.emoji === '🎈');
        expect(cake).toBeDefined();
        expect(balloon).toBeDefined();

        // Verify emoji positions are preserved (normalized coordinates)
        expect(cake!.x).toBe(0.15);
        expect(cake!.y).toBe(0.5);
        expect(balloon!.x).toBe(0.85);
        expect(balloon!.y).toBe(0.25);
    });

    test('should handle multi-page emoji distribution logic', () => {
        // Test behavior for page 1 (index 0)
        const page1Layout = calculateDecorativeLayout({
            decorative: mockDecorativeElements,
            dimensions: mockDimensions,
            pageIndex: 0,
            totalPages: 2,
        });

        // Test behavior for page 2 (index 1) 
        const page2Layout = calculateDecorativeLayout({
            decorative: mockDecorativeElements,
            dimensions: mockDimensions,
            pageIndex: 1,
            totalPages: 2,
        });

        // Both pages should have access to all emojis (filtering happens at render level)
        expect(page1Layout.emojis.length).toBe(2);
        expect(page2Layout.emojis.length).toBe(2);

        // Verify the emojis are consistent across pages
        const cake1 = page1Layout.emojis.find(e => e.emoji === '🎂');
        const balloon1 = page1Layout.emojis.find(e => e.emoji === '🎈');
        const cake2 = page2Layout.emojis.find(e => e.emoji === '🎂');
        const balloon2 = page2Layout.emojis.find(e => e.emoji === '🎈');

        expect(cake1).toBeDefined();
        expect(balloon1).toBeDefined();
        expect(cake2).toBeDefined();
        expect(balloon2).toBeDefined();
    });

    test('should calculate border paths correctly', () => {
        // Test border calculation logic
        const border = mockDecorativeElements.borders[0];
        const paths = calculateBorderPaths(border, {
            dimensions: mockDimensions,
            inkSaverMode: false
        });

        // Should generate border paths
        expect(paths.length).toBeGreaterThan(0);

        // Test heart pattern border
        expect(border.style.type).toBe('emoji');
        expect(border.style.emoji).toBe('❤️');

        // Verify border properties
        expect(border.position).toBe('all');
        expect(border.margin).toBe(0.3);
        expect(border.enabled).toBe(true);
    });

    test('should handle empty decorative elements gracefully', () => {
        const emptyDecorative: DecorativeElements = {
            borders: [],
            emojis: []
        };

        // Test that calculateDecorativeLayout handles empty elements
        const { emojis } = calculateDecorativeLayout({
            decorative: emptyDecorative,
            dimensions: mockDimensions,
            pageIndex: 0,
            totalPages: 1,
        });

        // Should return empty arrays without errors
        expect(emojis).toBeDefined();
        expect(emojis.length).toBe(0);

        // Test border calculation with empty borders
        expect(emptyDecorative.borders.length).toBe(0);
        expect(emptyDecorative.emojis.length).toBe(0);
    });
});
