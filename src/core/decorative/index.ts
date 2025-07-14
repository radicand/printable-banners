/**
 * Decorative elements module
 * Provides borders, emojis, and other decorative features for banners
 */

export * from './types';
export * from './borderRenderer';
export * from './layout';

// Re-export commonly used items
export {
    BORDER_STYLES,
    EMOJI_CATEGORIES,
    type BorderStyle,
    type BorderElement,
    type EmojiElement,
    type DecorativeElements,
    type EmojiCategory
} from './types';

export {
    calculateBorderPaths,
    createDefaultBorder,
    type BorderRenderContext,
    type RenderedBorder,
    type BorderPath
} from './borderRenderer';
