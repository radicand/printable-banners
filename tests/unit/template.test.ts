import { describe, expect, it } from 'bun:test';
import { TemplateManager, BUILT_IN_TEMPLATES } from '../../src/core/template';

describe('TemplateManager', () => {
    it('should return all built-in templates', () => {
        const templates = TemplateManager.getAllTemplates();
        expect(templates).toHaveLength(BUILT_IN_TEMPLATES.length);
        expect(templates).toEqual(BUILT_IN_TEMPLATES);
    });

    it('should filter templates by category', () => {
        const welcomeTemplates = TemplateManager.getTemplatesByCategory('welcome');
        const celebrationTemplates = TemplateManager.getTemplatesByCategory('celebration');

        expect(welcomeTemplates.every(t => t.category === 'welcome')).toBe(true);
        expect(celebrationTemplates.every(t => t.category === 'celebration')).toBe(true);
    });

    it('should find specific template by id', () => {
        const template = TemplateManager.getTemplate('welcome-home');
        expect(template).toBeDefined();
        expect(template?.name).toBe('Welcome Home');
        expect(template?.category).toBe('welcome');
    });

    it('should return undefined for non-existent template', () => {
        const template = TemplateManager.getTemplate('non-existent');
        expect(template).toBeUndefined();
    });

    it('should create banner from template', () => {
        const banner = TemplateManager.createBannerFromTemplate('welcome-home');

        expect(banner.title).toBe('Welcome Home Banner');
        expect(banner.pages[0].elements.length).toBeGreaterThan(0);
        expect(banner.pages[0].elements[0].text).toBe('WELCOME');
    });

    it('should throw error for invalid template id', () => {
        expect(() => {
            TemplateManager.createBannerFromTemplate('invalid-template');
        }).toThrow('Template with id "invalid-template" not found');
    });

    it('should return categories with counts', () => {
        const categories = TemplateManager.getCategories();

        expect(categories.length).toBeGreaterThan(0);
        categories.forEach(category => {
            expect(category.count).toBeGreaterThan(0);
            expect(typeof category.name).toBe('string');
        });
    });

    it('should create blank banner template', () => {
        const banner = TemplateManager.createBannerFromTemplate('blank');

        expect(banner.title).toBe('Custom Banner');
        expect(banner.pages[0].elements).toHaveLength(0);
    });
});
