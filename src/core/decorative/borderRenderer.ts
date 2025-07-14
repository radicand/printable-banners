/**
 * Border rendering utilities for decorative elements
 */

import { BorderElement, BorderStyle } from './types';
import { BannerDimensions } from '../banner/types';

export interface BorderRenderContext {
    dimensions: BannerDimensions;
    inkSaverMode: boolean;
}

export interface RenderedBorder {
    element: BorderElement;
    paths: BorderPath[];
}

export interface BorderPath {
    type: 'line' | 'emoji' | 'image';
    x1?: number;
    y1?: number;
    x2?: number;
    y2?: number;
    emoji?: string;
    x?: number;
    y?: number;
    size?: number;
    width?: number;
    height?: number;
    dataUrl?: string; // For image-based emoji rendering
    color?: string;
    thickness?: number;
    dashArray?: number[];
}

/**
 * Calculate border paths for rendering
 */
export function calculateBorderPaths(
    border: BorderElement,
    context: BorderRenderContext
): BorderPath[] {
    const { dimensions } = context;
    const { style, margin } = border;

    // Convert dimensions to pixels (assuming 72 DPI)
    const width = dimensions.unit === 'in' ? dimensions.width * 72 : dimensions.width;
    const height = dimensions.unit === 'in' ? dimensions.height * 72 : dimensions.height;
    const marginPx = dimensions.unit === 'in' ? margin * 72 : margin;

    if (style.type === 'emoji' && style.emoji) {
        return calculateEmojiBorderPaths(border, width, height, marginPx);
    } else {
        return calculateLineBorderPaths(border, width, height, marginPx);
    }
}

function calculateLineBorderPaths(
    border: BorderElement,
    width: number,
    height: number,
    margin: number
): BorderPath[] {
    const { style, position } = border;
    const paths: BorderPath[] = [];

    const dashArray = style.type === 'dashed' ? [5, 5] :
        style.type === 'dotted' ? [2, 3] : undefined;

    if (position === 'top' || position === 'all') {
        paths.push({
            type: 'line',
            x1: margin,
            y1: margin,
            x2: width - margin,
            y2: margin,
            color: style.color || '#000000',
            thickness: style.thickness || 1,
            dashArray
        });
    }

    if (position === 'bottom' || position === 'all') {
        paths.push({
            type: 'line',
            x1: margin,
            y1: height - margin,
            x2: width - margin,
            y2: height - margin,
            color: style.color || '#000000',
            thickness: style.thickness || 1,
            dashArray
        });
    }

    if (position === 'left' || position === 'all') {
        paths.push({
            type: 'line',
            x1: margin,
            y1: margin,
            x2: margin,
            y2: height - margin,
            color: style.color || '#000000',
            thickness: style.thickness || 1,
            dashArray
        });
    }

    if (position === 'right' || position === 'all') {
        paths.push({
            type: 'line',
            x1: width - margin,
            y1: margin,
            x2: width - margin,
            y2: height - margin,
            color: style.color || '#000000',
            thickness: style.thickness || 1,
            dashArray
        });
    }

    return paths;
}

function calculateEmojiBorderPaths(
    border: BorderElement,
    width: number,
    height: number,
    margin: number
): BorderPath[] {
    const { style, position } = border;
    const paths: BorderPath[] = [];

    if (!style.emoji || !style.spacing) return paths;

    const spacing = style.spacing;
    const size = 16; // Default emoji size

    if (position === 'top' || position === 'all') {
        const count = Math.floor((width - 2 * margin) / spacing);
        for (let i = 0; i < count; i++) {
            paths.push({
                type: 'emoji',
                emoji: style.emoji,
                x: margin + (i * spacing),
                y: margin,
                size
            });
        }
    }

    if (position === 'bottom' || position === 'all') {
        const count = Math.floor((width - 2 * margin) / spacing);
        for (let i = 0; i < count; i++) {
            paths.push({
                type: 'emoji',
                emoji: style.emoji,
                x: margin + (i * spacing),
                y: height - margin,
                size
            });
        }
    }

    if (position === 'left' || position === 'all') {
        const count = Math.floor((height - 2 * margin) / spacing);
        for (let i = 0; i < count; i++) {
            paths.push({
                type: 'emoji',
                emoji: style.emoji,
                x: margin,
                y: margin + (i * spacing),
                size
            });
        }
    }

    if (position === 'right' || position === 'all') {
        const count = Math.floor((height - 2 * margin) / spacing);
        for (let i = 0; i < count; i++) {
            paths.push({
                type: 'emoji',
                emoji: style.emoji,
                x: width - margin,
                y: margin + (i * spacing),
                size
            });
        }
    }

    return paths;
}

/**
 * Create a default border element
 */
export function createDefaultBorder(styleId: string): BorderElement {
    return {
        id: `border-${Date.now()}`,
        style: { id: styleId } as BorderStyle, // Will be resolved from BORDER_STYLES
        position: 'all',
        margin: 0.25, // Quarter inch margin
        enabled: true
    };
}
