import { describe, expect, test } from 'bun:test';
import { TemplateManager } from '../../src/core/template';

describe('Enhanced Templates with Decorative Elements', () => {
    test('should create Welcome Home template with heart borders and emojis', () => {
        const template = TemplateManager.getTemplate('welcome-home');
        expect(template).toBeDefined();

        if (template) {
            const banner = template.create();

            // Check that banner has decorative elements
            expect(banner.decorative).toBeDefined();
            expect(banner.decorative.borders).toHaveLength(1);
            expect(banner.decorative.emojis).toHaveLength(4);

            // Check heart border
            const heartBorder = banner.decorative.borders[0];
            expect(heartBorder.style.emoji).toBe('❤️');
            expect(heartBorder.position).toBe('all');

            // Check emojis include home and celebration themes
            const emojiTexts = banner.decorative.emojis.map(e => e.emoji);
            expect(emojiTexts).toContain('🏠');
            expect(emojiTexts).toContain('💖');
            expect(emojiTexts).toContain('🎉');
            expect(emojiTexts).toContain('✨');
        }
    });

    test('should create Congratulations template with star borders and achievement emojis', () => {
        const template = TemplateManager.getTemplate('congratulations');
        expect(template).toBeDefined();

        if (template) {
            const banner = template.create();

            // Check decorative elements
            expect(banner.decorative.borders).toHaveLength(1);
            expect(banner.decorative.emojis).toHaveLength(4);

            // Check star border
            const starBorder = banner.decorative.borders[0];
            expect(starBorder.style.emoji).toBe('⭐');

            // Check achievement emojis
            const emojiTexts = banner.decorative.emojis.map(e => e.emoji);
            expect(emojiTexts).toContain('🏆');
            expect(emojiTexts).toContain('🎉');
            expect(emojiTexts).toContain('✨');
            expect(emojiTexts).toContain('🌟');
        }
    });

    test('should create Happy Birthday template with celebration borders and party emojis', () => {
        const template = TemplateManager.getTemplate('happy-birthday');
        expect(template).toBeDefined();

        if (template) {
            const banner = template.create();

            // Check decorative elements
            expect(banner.decorative.borders).toHaveLength(1);
            expect(banner.decorative.emojis).toHaveLength(5);

            // Check celebration border (🎉)
            const celebrationBorder = banner.decorative.borders[0];
            expect(celebrationBorder.style.emoji).toBe('🎉');

            // Check birthday party emojis
            const emojiTexts = banner.decorative.emojis.map(e => e.emoji);
            expect(emojiTexts).toContain('🎂');
            expect(emojiTexts).toContain('🎈');
            expect(emojiTexts).toContain('🎁');
            expect(emojiTexts).toContain('🥳');
            expect(emojiTexts).toContain('🍰');
        }
    });

    test('should create new Party Time template with maximum decorative elements', () => {
        const template = TemplateManager.getTemplate('party-time');
        expect(template).toBeDefined();

        if (template) {
            const banner = template.create();

            // Check it has lots of decorative elements
            expect(banner.decorative.borders).toHaveLength(2); // Top and bottom borders
            expect(banner.decorative.emojis).toHaveLength(8); // Maximum celebration

            // Check multiple border types
            const borderEmojis = banner.decorative.borders.map(b => b.style.emoji);
            expect(borderEmojis).toContain('🎉'); // Celebration pattern
            expect(borderEmojis).toContain('⭐'); // Star pattern

            // Check text styling
            expect(banner.pages[0].elements).toHaveLength(2);
            expect(banner.pages[0].elements[0].text).toBe('PARTY');
            expect(banner.pages[0].elements[1].text).toBe('TIME!');
            expect(banner.pages[0].elements[0].color).toBe('#f59e0b'); // Amber
            expect(banner.pages[0].elements[1].color).toBe('#8b5cf6'); // Purple
        }
    });

    test('should verify all enhanced templates have decorative elements', () => {
        const templates = TemplateManager.getAllTemplates();
        const enhancedTemplates = templates.filter(t =>
            t.id !== 'blank' // Blank template intentionally has no decorations
        );

        enhancedTemplates.forEach(template => {
            const banner = template.create();
            const hasDecorations =
                banner.decorative.borders.length > 0 ||
                banner.decorative.emojis.length > 0;

            expect(hasDecorations).toBe(true);
        });
    });

    test('should verify new celebration border style is available', () => {
        const template = TemplateManager.getTemplate('party-time');
        expect(template).toBeDefined();

        if (template) {
            const banner = template.create();
            const celebrationBorder = banner.decorative.borders.find(
                b => b.style.id === 'celebration-pattern'
            );

            expect(celebrationBorder).toBeDefined();
            expect(celebrationBorder?.style.emoji).toBe('🎉');
            expect(celebrationBorder?.style.name).toBe('Celebration Border');
        }
    });
});
