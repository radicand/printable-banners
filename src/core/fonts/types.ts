/**
 * Font system types and interfaces
 */

export interface SystemFont {
    name: string;
    family: string;
    fallbacks: string[];
    category: 'serif' | 'sans-serif' | 'display' | 'handwriting' | 'monospace';
    available?: boolean;
    weight?: string;
    style?: string;
}

export interface FontCategory {
    id: string;
    name: string;
    description: string;
    fonts: SystemFont[];
}

export interface FontDetectionResult {
    available: SystemFont[];
    unavailable: SystemFont[];
    fallbackMap: Record<string, string>;
}

/**
 * Comprehensive system font library with fallbacks
 */
export const SYSTEM_FONTS: SystemFont[] = [
    // Serif Fonts
    {
        name: 'Georgia',
        family: 'Georgia',
        fallbacks: ['Times New Roman', 'Times', 'serif'],
        category: 'serif',
        weight: 'normal',
        style: 'normal'
    },
    {
        name: 'Times New Roman',
        family: 'Times New Roman',
        fallbacks: ['Times', 'Georgia', 'serif'],
        category: 'serif',
        weight: 'normal',
        style: 'normal'
    },
    {
        name: 'Book Antiqua',
        family: 'Book Antiqua',
        fallbacks: ['Palatino', 'Georgia', 'serif'],
        category: 'serif',
        weight: 'normal',
        style: 'normal'
    },
    {
        name: 'Palatino',
        family: 'Palatino',
        fallbacks: ['Book Antiqua', 'Georgia', 'serif'],
        category: 'serif',
        weight: 'normal',
        style: 'normal'
    },

    // Sans Serif Fonts
    {
        name: 'Arial',
        family: 'Arial',
        fallbacks: ['Helvetica', 'sans-serif'],
        category: 'sans-serif',
        weight: 'normal',
        style: 'normal'
    },
    {
        name: 'Helvetica',
        family: 'Helvetica',
        fallbacks: ['Arial', 'sans-serif'],
        category: 'sans-serif',
        weight: 'normal',
        style: 'normal'
    },
    {
        name: 'Verdana',
        family: 'Verdana',
        fallbacks: ['Arial', 'Helvetica', 'sans-serif'],
        category: 'sans-serif',
        weight: 'normal',
        style: 'normal'
    },
    {
        name: 'Tahoma',
        family: 'Tahoma',
        fallbacks: ['Verdana', 'Arial', 'sans-serif'],
        category: 'sans-serif',
        weight: 'normal',
        style: 'normal'
    },
    {
        name: 'Trebuchet MS',
        family: 'Trebuchet MS',
        fallbacks: ['Arial', 'Helvetica', 'sans-serif'],
        category: 'sans-serif',
        weight: 'normal',
        style: 'normal'
    },
    {
        name: 'Calibri',
        family: 'Calibri',
        fallbacks: ['Arial', 'Helvetica', 'sans-serif'],
        category: 'sans-serif',
        weight: 'normal',
        style: 'normal'
    },

    // Display Fonts
    {
        name: 'Impact',
        family: 'Impact',
        fallbacks: ['Arial Black', 'Helvetica', 'sans-serif'],
        category: 'display',
        weight: 'bold',
        style: 'normal'
    },
    {
        name: 'Arial Black',
        family: 'Arial Black',
        fallbacks: ['Impact', 'Arial', 'sans-serif'],
        category: 'display',
        weight: 'bold',
        style: 'normal'
    },
    {
        name: 'Franklin Gothic Medium',
        family: 'Franklin Gothic Medium',
        fallbacks: ['Arial', 'Helvetica', 'sans-serif'],
        category: 'display',
        weight: 'bold',
        style: 'normal'
    },

    // Handwriting/Script Fonts
    {
        name: 'Brush Script MT',
        family: 'Brush Script MT',
        fallbacks: ['Comic Sans MS', 'cursive'],
        category: 'handwriting',
        weight: 'normal',
        style: 'normal'
    },
    {
        name: 'Comic Sans MS',
        family: 'Comic Sans MS',
        fallbacks: ['Brush Script MT', 'cursive'],
        category: 'handwriting',
        weight: 'normal',
        style: 'normal'
    },

    // Monospace Fonts
    {
        name: 'Courier New',
        family: 'Courier New',
        fallbacks: ['Courier', 'monospace'],
        category: 'monospace',
        weight: 'normal',
        style: 'normal'
    },
    {
        name: 'Lucida Console',
        family: 'Lucida Console',
        fallbacks: ['Courier New', 'monospace'],
        category: 'monospace',
        weight: 'normal',
        style: 'normal'
    }
];

/**
 * Font categories for UI organization
 */
export const FONT_CATEGORIES: FontCategory[] = [
    {
        id: 'serif',
        name: 'Serif',
        description: 'Traditional fonts with decorative strokes',
        fonts: SYSTEM_FONTS.filter(f => f.category === 'serif')
    },
    {
        id: 'sans-serif',
        name: 'Sans Serif',
        description: 'Clean, modern fonts without decorative strokes',
        fonts: SYSTEM_FONTS.filter(f => f.category === 'sans-serif')
    },
    {
        id: 'display',
        name: 'Display',
        description: 'Bold, attention-grabbing fonts for headers',
        fonts: SYSTEM_FONTS.filter(f => f.category === 'display')
    },
    {
        id: 'handwriting',
        name: 'Handwriting',
        description: 'Casual, script-like fonts',
        fonts: SYSTEM_FONTS.filter(f => f.category === 'handwriting')
    },
    {
        id: 'monospace',
        name: 'Monospace',
        description: 'Fixed-width fonts',
        fonts: SYSTEM_FONTS.filter(f => f.category === 'monospace')
    }
];
