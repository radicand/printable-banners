/**
 * Types for decorative elements like borders and emojis
 */

export interface BorderStyle {
    id: string;
    name: string;
    description: string;
    type: 'solid' | 'dashed' | 'dotted' | 'pattern' | 'emoji';
    thickness?: number; // in points (not needed for emoji borders)
    color?: string; // For solid/dashed/dotted borders
    // For pattern borders: support separate SVGs for horizontal and vertical
    pattern?: string; // For horizontal (top/bottom) SVG
    patternVertical?: string; // For vertical (left/right) SVG
    emoji?: string; // For emoji borders
    spacing?: number; // For pattern/emoji spacing
}

export interface BorderElement {
    id: string;
    style: BorderStyle;
    position: 'top' | 'bottom' | 'left' | 'right' | 'all';
    margin: number; // Distance from page edge
    enabled: boolean;
}

export interface EmojiElement {
    id: string;
    emoji: string;
    x: number;
    y: number;
    size: number; // Font size for emoji
    rotation: number;
}

export interface DecorativeElements {
    borders: BorderElement[];
    emojis: EmojiElement[];
}

// Predefined border styles
export const BORDER_STYLES: BorderStyle[] = [
    {
        id: 'solid-thin',
        name: 'Thin Line',
        description: 'Simple thin solid line',
        type: 'solid',
        thickness: 1,
        color: '#000000'
    },
    {
        id: 'solid-thick',
        name: 'Thick Line',
        description: 'Bold solid line',
        type: 'solid',
        thickness: 3,
        color: '#000000'
    },
    {
        id: 'dashed',
        name: 'Dashed Line',
        description: 'Dashed border line',
        type: 'dashed',
        thickness: 2,
        color: '#000000'
    },
    {
        id: 'dotted',
        name: 'Dotted Line',
        description: 'Dotted border line',
        type: 'dotted',
        thickness: 2,
        color: '#000000'
    },
    {
        id: 'star-pattern',
        name: 'Star Border',
        description: 'Repeating star pattern',
        type: 'emoji',
        thickness: 0,
        emoji: '⭐',
        spacing: 30
    },
    {
        id: 'heart-pattern',
        name: 'Heart Border',
        description: 'Repeating heart pattern',
        type: 'emoji',
        emoji: '❤️',
        spacing: 25
    },
    {
        id: 'flower-pattern',
        name: 'Flower Border',
        description: 'Repeating flower pattern',
        type: 'emoji',
        emoji: '🌸',
        spacing: 35
    },
    {
        id: 'celebration-pattern',
        name: 'Celebration Border',
        description: 'Repeating celebration pattern',
        type: 'emoji',
        emoji: '🎉',
        spacing: 30
    },
    {
        id: 'flower-vine-svg',
        name: 'Flower Vine',
        description: 'Decorative flower vine SVG border (separate SVGs for horizontal and vertical, both must be square)',
        type: 'pattern',
        // Horizontal SVG (top/bottom)
        pattern: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 20 Q10 2, 20 20 T38 20" stroke="#4CAF50" stroke-width="2" fill="none"/><circle cx="10" cy="14" r="2" fill="#FF69B4"/><circle cx="20" cy="20" r="2.5" fill="#FFD700"/><circle cx="30" cy="14" r="2" fill="#FF69B4"/></svg>`,
        // Vertical SVG (left/right) - now a true vertical vine
        patternVertical: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 2 Q38 10, 20 20 T20 38" stroke="#4CAF50" stroke-width="2" fill="none"/><circle cx="14" cy="10" r="2" fill="#FF69B4"/><circle cx="20" cy="20" r="2.5" fill="#FFD700"/><circle cx="14" cy="30" r="2" fill="#FF69B4"/></svg>`,
        spacing: 40
    }
];

// Common emoji categories for decoration
export const EMOJI_CATEGORIES = {
    celebration: ['🎉', '🎊', '🎈', '🎁', '🍰', '🥳', '✨', '🌟'],
    hearts: ['❤️', '💖', '💕', '💗', '💙', '💚', '💛', '🧡'],
    nature: ['🌸', '🌺', '🌻', '🌹', '🌷', '🍀', '🌿', '🌱'],
    stars: ['⭐', '🌟', '✨', '💫', '🌠', '⚡', '☀️', '🌙'],
    fun: ['😊', '😄', '🤗', '😍', '🥰', '😘', '🤩', '😎']
} as const;

export type EmojiCategory = keyof typeof EMOJI_CATEGORIES;
