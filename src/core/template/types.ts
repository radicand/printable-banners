import { Banner, BannerDimensions } from '../banner';

export interface BannerTemplate {
    id: string;
    name: string;
    description: string;
    category: 'welcome' | 'celebration' | 'announcement' | 'custom';
    preview: string; // Base64 image or SVG string for preview
    defaultText: string[];
    create: (dimensions?: BannerDimensions) => Banner;
}

export interface TemplateCategory {
    id: string;
    name: string;
    description: string;
    templates: BannerTemplate[];
}
