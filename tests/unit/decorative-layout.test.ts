import { describe, expect, test } from 'bun:test';
import { calculateDecorativeLayout } from '../../src/core/decorative/layout';
import { DecorativeElements } from '../../src/core/decorative/types';
import { BannerDimensions } from '../../src/core/banner/types';

describe('calculateDecorativeLayout', () => {
    const mockDimensions: BannerDimensions = {
        width: 11,
        height: 8.5,
        unit: 'in',
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
                    spacing: 25,
                },
                position: 'all',
                margin: 0.3,
                enabled: true,
            },
        ],
        emojis: [
            {
                id: 'emoji-1',
                emoji: '🎂',
                x: 0.15,
                y: 0.5,
                size: 48,
                rotation: 0,
            },
            {
                id: 'emoji-2',
                emoji: '🎈',
                x: 0.85,
                y: 0.25,
                size: 42,
                rotation: 0,
            },
        ],
    };

    test('should position emojis correctly for single page', () => {
        const { emojis } = calculateDecorativeLayout({
            decorative: mockDecorativeElements,
            dimensions: mockDimensions,
            containerWidth: 258,
            containerHeight: 200,
            pageIndex: 0,
            totalPages: 1,
        });
        // Both emojis should be present
        expect(emojis.length).toBe(2);
        const cake = emojis.find(e => e.emoji === '🎂');
        const balloon = emojis.find(e => e.emoji === '🎈');
        expect(cake).toBeDefined();
        expect(balloon).toBeDefined();
        expect(cake!.x).toBeCloseTo(0.15 * 258, 1);
        expect(cake!.y).toBeCloseTo(0.5 * 200, 1);
        expect(balloon!.x).toBeCloseTo(0.85 * 258, 1);
        expect(balloon!.y).toBeCloseTo(0.25 * 200, 1);
    });

    test('should distribute emojis across multi-page preview', () => {
        // Page 1 (index 0)
        const { emojis: page1 } = calculateDecorativeLayout({
            decorative: mockDecorativeElements,
            dimensions: mockDimensions,
            containerWidth: 258,
            containerHeight: 200,
            pageIndex: 0,
            totalPages: 2,
        });
        // Page 2 (index 1)
        const { emojis: page2 } = calculateDecorativeLayout({
            decorative: mockDecorativeElements,
            dimensions: mockDimensions,
            containerWidth: 258,
            containerHeight: 200,
            pageIndex: 1,
            totalPages: 2,
        });
        // Page 1 should have the cake emoji
        expect(page1.some(e => e.emoji === '🎂')).toBe(true);
        // Page 2 should have the balloon emoji
        expect(page2.some(e => e.emoji === '🎈')).toBe(true);
    });

    test('should handle empty decorative elements gracefully', () => {
        const { emojis } = calculateDecorativeLayout({
            decorative: { borders: [], emojis: [] },
            dimensions: mockDimensions,
            containerWidth: 258,
            containerHeight: 200,
            pageIndex: 0,
            totalPages: 1,
        });
        expect(emojis.length).toBe(0);
    });
});
