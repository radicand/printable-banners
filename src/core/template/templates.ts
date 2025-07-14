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
        return template.create(dimensions);
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
