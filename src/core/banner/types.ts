/**
 * Core banner model representing the structure and properties of a banner
 */

import { DecorativeElements } from '../decorative/types';

export interface BannerDimensions {
    width: number;
    height: number;
    unit: 'in' | 'cm' | 'px';
}

export interface BannerTextElement {
    id: string;
    text: string;
    fontSize: number;
    fontFamily: string;
    color: string;
    x: number;
    y: number;
    rotation: number;
    outline: boolean; // For ink saver mode
}

export interface BannerPage {
    pageNumber: number;
    elements: BannerTextElement[];
}

export interface Banner {
    id: string;
    title: string;
    dimensions: BannerDimensions;
    pages: BannerPage[];
    backgroundColor: string;
    inkSaverMode: boolean;
    decorative: DecorativeElements;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Default banner configuration
 */
export const DEFAULT_BANNER_CONFIG = {
    dimensions: {
        width: 11,    // Landscape: 11" wide
        height: 8.5,  // Landscape: 8.5" tall
        unit: 'in' as const,
    },
    backgroundColor: '#ffffff',
    inkSaverMode: false,
} as const;

/**
 * Standard page size presets
 */
export const PAGE_SIZE_PRESETS = {
    'US Letter': { width: 8.5, height: 11, unit: 'in' as const },
    'A4': { width: 21, height: 29.7, unit: 'cm' as const },
    'US Legal': { width: 8.5, height: 14, unit: 'in' as const },
} as const;

export type PageSizePreset = keyof typeof PAGE_SIZE_PRESETS;
