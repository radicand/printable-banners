import { BannerTemplate } from './types';
import { BannerFactory, BannerUtils, BannerDimensions } from '../banner';

/**
 * Built-in banner templates
 */
export const BUILT_IN_TEMPLATES: BannerTemplate[] = [
    {
        id: 'welcome-home',
        name: 'Welcome Home',
        description: 'Perfect for welcoming someone back home',
        category: 'welcome',
        preview: '', // Will be generated or provided later
        defaultText: ['WELCOME', 'HOME!'],
        create: (dimensions?: BannerDimensions) => {
            let banner = BannerFactory.createBannerWithText(
                'Welcome Home Banner',
                'WELCOME',
                dimensions
            );
            banner = BannerUtils.addTextElement(banner, 'HOME!');

            // Position the text elements
            banner = BannerUtils.updateTextElement(banner, banner.pages[0].elements[0].id, {
                y: 0.4, // Position "WELCOME" slightly higher
                fontSize: 252 // 84 * 3 - now using actual print size
            });

            banner = BannerUtils.updateTextElement(banner, banner.pages[0].elements[1].id, {
                y: 0.6, // Position "HOME!" slightly lower
                fontSize: 252, // 84 * 3 - now using actual print size
                color: '#dc2626' // Red color for emphasis
            });

            // Add decorative elements - heart border for warmth
            banner = BannerUtils.addBorder(banner, 'heart-pattern', 'all', 0.3);

            // Add scattered celebration emojis distributed for multi-page support
            banner = BannerUtils.addEmoji(banner, '🏠', 0.2, 0.2, 40);   // Home emoji left side
            banner = BannerUtils.addEmoji(banner, '💖', 0.8, 0.2, 36);   // Heart emoji right side
            banner = BannerUtils.addEmoji(banner, '🎉', 0.2, 0.8, 32);   // Celebration left side
            banner = BannerUtils.addEmoji(banner, '✨', 0.8, 0.8, 28);   // Sparkle right side

            return banner;
        }
    },
    {
        id: 'congratulations',
        name: 'Congratulations',
        description: 'Celebrate achievements and milestones',
        category: 'celebration',
        preview: '',
        defaultText: ['CONGRATULATIONS!'],
        create: (dimensions?: BannerDimensions) => {
            let banner = BannerFactory.createBannerWithText(
                'Congratulations Banner',
                'CONGRATULATIONS!',
                dimensions
            );

            banner = BannerUtils.updateTextElement(banner, banner.pages[0].elements[0].id, {
                fontSize: 288, // 96 * 3 - now using actual print size
                color: '#059669', // Green color for celebration
                fontFamily: 'Georgia'
            });

            // Add decorative elements - star border for achievement
            banner = BannerUtils.addBorder(banner, 'star-pattern', 'all', 0.25);

            // Add celebration emojis distributed for multi-page support
            banner = BannerUtils.addEmoji(banner, '🏆', 0.15, 0.15, 44);  // Trophy left side
            banner = BannerUtils.addEmoji(banner, '🎉', 0.85, 0.15, 40);  // Celebration right side
            banner = BannerUtils.addEmoji(banner, '✨', 0.15, 0.85, 36);  // Sparkle left side
            banner = BannerUtils.addEmoji(banner, '🌟', 0.85, 0.85, 38); // Star right side

            return banner;
        }
    },
    {
        id: 'happy-birthday',
        name: 'Happy Birthday',
        description: 'Birthday celebration banner',
        category: 'celebration',
        preview: '',
        defaultText: ['HAPPY', 'BIRTHDAY!'],
        create: (dimensions?: BannerDimensions) => {
            let banner = BannerFactory.createBannerWithText(
                'Happy Birthday Banner',
                'HAPPY',
                dimensions
            );
            banner = BannerUtils.addTextElement(banner, 'BIRTHDAY!');

            // Position and style the text
            banner = BannerUtils.updateTextElement(banner, banner.pages[0].elements[0].id, {
                y: 0.35,
                fontSize: 264, // 88 * 3 - now using actual print size
                color: '#7c3aed' // Purple
            });

            banner = BannerUtils.updateTextElement(banner, banner.pages[0].elements[1].id, {
                y: 0.65,
                fontSize: 264, // 88 * 3 - now using actual print size
                color: '#ec4899' // Pink
            });

            // Add decorative elements - celebration border
            banner = BannerUtils.addBorder(banner, 'celebration-pattern', 'all', 0.2);

            // Add fun birthday emojis distributed across banner width for multi-page support
            banner = BannerUtils.addEmoji(banner, '🎂', 0.15, 0.5, 48);   // Page 1: cake in left-center
            banner = BannerUtils.addEmoji(banner, '🎈', 0.85, 0.25, 42);  // Page 1/2: balloon upper-right
            banner = BannerUtils.addEmoji(banner, '🎁', 0.85, 0.75, 40);  // Page 1/2: gift lower-right  
            banner = BannerUtils.addEmoji(banner, '🥳', 0.15, 0.15, 38);  // Page 1: party face upper-left
            banner = BannerUtils.addEmoji(banner, '🍰', 0.15, 0.85, 36);  // Page 1: cake slice lower-left

            return banner;
        }
    },
    {
        id: 'party-time',
        name: 'Party Time',
        description: 'Ultimate celebration banner with full decorative elements',
        category: 'celebration',
        preview: '',
        defaultText: ['PARTY', 'TIME!'],
        create: (dimensions?: BannerDimensions) => {
            let banner = BannerFactory.createBannerWithText(
                'Party Time Banner',
                'PARTY',
                dimensions
            );
            banner = BannerUtils.addTextElement(banner, 'TIME!');

            // Style the text with vibrant colors
            banner = BannerUtils.updateTextElement(banner, banner.pages[0].elements[0].id, {
                y: 0.3,
                fontSize: 300,
                color: '#f59e0b', // Amber
                fontFamily: 'Impact'
            });

            banner = BannerUtils.updateTextElement(banner, banner.pages[0].elements[1].id, {
                y: 0.7,
                fontSize: 300,
                color: '#8b5cf6', // Purple
                fontFamily: 'Impact'
            });

            // Add multiple decorative borders
            banner = BannerUtils.addBorder(banner, 'celebration-pattern', 'top', 0.15);
            banner = BannerUtils.addBorder(banner, 'star-pattern', 'bottom', 0.15);

            // Add lots of fun emojis for maximum celebration
            banner = BannerUtils.addEmoji(banner, '🎉', 0.08, 0.12, 45);
            banner = BannerUtils.addEmoji(banner, '🎊', 0.92, 0.12, 42);
            banner = BannerUtils.addEmoji(banner, '🎈', 0.08, 0.5, 40);
            banner = BannerUtils.addEmoji(banner, '🎁', 0.92, 0.5, 38);
            banner = BannerUtils.addEmoji(banner, '🥳', 0.08, 0.88, 44);
            banner = BannerUtils.addEmoji(banner, '✨', 0.92, 0.88, 36);
            banner = BannerUtils.addEmoji(banner, '🌟', 0.25, 0.15, 34);
            banner = BannerUtils.addEmoji(banner, '💫', 0.75, 0.85, 32);

            return banner;
        }
    },
    {
        id: 'blank',
        name: 'Blank Banner',
        description: 'Start with a completely blank banner',
        category: 'custom',
        preview: '',
        defaultText: [],
        create: (dimensions?: BannerDimensions) => {
            return BannerFactory.createEmptyBanner('Custom Banner', dimensions);
        }
    }
];

/**
 * Template management utilities
 */
export class TemplateManager {
    static getAllTemplates(): BannerTemplate[] {
        return BUILT_IN_TEMPLATES;
    }

    static getTemplatesByCategory(category: BannerTemplate['category']): BannerTemplate[] {
        return BUILT_IN_TEMPLATES.filter(template => template.category === category);
    }

    static getTemplate(id: string): BannerTemplate | undefined {
        return BUILT_IN_TEMPLATES.find(template => template.id === id);
    }

    static createBannerFromTemplate(templateId: string, dimensions?: BannerDimensions) {
        const template = this.getTemplate(templateId);
        if (!template) {
            throw new Error(`Template with id "${templateId}" not found`);
        }
        // Create banner and apply custom dimensions if provided
        let banner = template.create();
        if (dimensions) {
            banner.dimensions = dimensions;
        }
        return banner;
    }

    static getCategories(): Array<{ id: BannerTemplate['category'], name: string, count: number }> {
        const categories = {
            welcome: { id: 'welcome' as const, name: 'Welcome', count: 0 },
            celebration: { id: 'celebration' as const, name: 'Celebration', count: 0 },
            announcement: { id: 'announcement' as const, name: 'Announcement', count: 0 },
            custom: { id: 'custom' as const, name: 'Custom', count: 0 },
        };

        BUILT_IN_TEMPLATES.forEach(template => {
            categories[template.category].count++;
        });

        return Object.values(categories).filter(cat => cat.count > 0);
    }
}
