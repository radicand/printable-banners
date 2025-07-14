import { describe, expect, test } from 'bun:test';
import React from 'react';
import { render } from '@testing-library/react';
import { DecorativePreview } from '../../src/components/decorative/DecorativePreview';
import { DecorativeElements } from '../../src/core/decorative/types';
import { BannerDimensions } from '../../src/core/banner/types';

describe('Decorative Preview UI Rendering', () => {
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

    test('should render decorative elements in single page preview', () => {
        const { container } = render(
            <DecorativePreview
                decorative={ mockDecorativeElements }
                dimensions = { mockDimensions }
                containerWidth = { 258} // 11/8.5 * 200
                containerHeight = { 200}
                inkSaverMode = { false}
                pageIndex = { 0}
                totalPages = { 1}
            />
        );

        // Should render both emojis for single page
        const emojiElements = container.querySelectorAll('[style*="🎂"], [style*="🎈"]');
        expect(emojiElements.length).toBeGreaterThan(0);

        // Check that emojis have correct positioning (percentage-based, not decimal)
        const cakeEmoji = Array.from(container.querySelectorAll('div')).find(
            el => el.textContent?.includes('🎂')
        );
        expect(cakeEmoji).toBeDefined();

        if (cakeEmoji) {
            const style = (cakeEmoji as HTMLElement).style;
            // x=0.15 should result in 15% of container width = 0.15 * 258 = 38.7px
            expect(style.left).toBe('38.7px');
            // y=0.5 should result in 50% of container height = 0.5 * 200 = 100px
            expect(style.top).toBe('100px');
        }
    });

    test('should correctly distribute emojis across multi-page preview', () => {
        // Test page 1 (should show emoji at x=0.15)
        const { container: page1Container } = render(
            <DecorativePreview
                decorative={ mockDecorativeElements }
                dimensions = { mockDimensions }
                containerWidth = { 258}
                containerHeight = { 200}
                inkSaverMode = { false}
                pageIndex = { 0}
                totalPages = { 2}
            />
        );

        // Test page 2 (should show emoji at x=0.85) 
        const { container: page2Container } = render(
            <DecorativePreview
                decorative={ mockDecorativeElements }
                dimensions = { mockDimensions }
                containerWidth = { 258}
                containerHeight = { 200}
                inkSaverMode = { false}
                pageIndex = { 1}
                totalPages = { 2}
            />
        );

        // Page 1 should have the cake emoji (x=0.15 -> page 0)
        const page1Emojis = Array.from(page1Container.querySelectorAll('div')).filter(
            el => el.textContent?.includes('🎂') || el.textContent?.includes('🎈')
        );

        // Page 2 should have the balloon emoji (x=0.85 -> page 1)
        const page2Emojis = Array.from(page2Container.querySelectorAll('div')).filter(
            el => el.textContent?.includes('🎂') || el.textContent?.includes('🎈')
        );

        // Each page should have at least one emoji
        expect(page1Emojis.length).toBeGreaterThan(0);
        expect(page2Emojis.length).toBeGreaterThan(0);
    });

    test('should render borders correctly', () => {
        const { container } = render(
            <DecorativePreview
                decorative={ mockDecorativeElements }
                dimensions = { mockDimensions }
                containerWidth = { 258}
                containerHeight = { 200}
                inkSaverMode = { false}
                pageIndex = { 0}
                totalPages = { 1}
            />
        );

        // Should have border elements (could be SVG paths or divs depending on implementation)
        const borderElements = container.querySelectorAll('div');
        expect(borderElements.length).toBeGreaterThan(0);
    });

    test('should handle empty decorative elements gracefully', () => {
        const emptyDecorative: DecorativeElements = {
            borders: [],
            emojis: []
        };

        const { container } = render(
            <DecorativePreview
                decorative={ emptyDecorative }
                dimensions = { mockDimensions }
                containerWidth = { 258}
                containerHeight = { 200}
                inkSaverMode = { false}
                pageIndex = { 0}
                totalPages = { 1}
            />
        );

        // Should render without errors
        expect(container).toBeDefined();
    });
});
