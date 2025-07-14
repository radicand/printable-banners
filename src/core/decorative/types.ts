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
    pattern?: string; // For pattern borders (SVG or character)
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
