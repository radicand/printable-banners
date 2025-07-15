import { DecorativeElements, EmojiElement } from './types';
import { BannerDimensions } from '../banner/types';

/**
 * Calculates the layout for decorative elements (emojis, etc.) for a banner.
 * Returns positioned emojis for rendering.
 */
export function calculateDecorativeLayout({
  decorative,
  dimensions: _dimensions,
  pageIndex = 0,
  totalPages = 1,
}: {
  decorative: DecorativeElements;
  dimensions: BannerDimensions;
  pageIndex?: number;
  totalPages?: number;
}): { emojis: EmojiElement[] } {
  // For single page, return all emojis as-is
  if (totalPages === 1) {
    return {
      emojis: decorative.emojis || [],
    };
  }
  // For multi-page: only include emojis that belong on this page, and map x to local page coordinates
  const pageEmojis: EmojiElement[] = (decorative.emojis || [])
    .filter(e => {
      // x is normalized 0-1 across the whole banner
      const emojiPage = Math.floor(e.x * totalPages);
      return emojiPage === pageIndex;
    })
    .map(e => {
      // Map x to local page coordinates (0-1)
      const emojiPage = Math.floor(e.x * totalPages);
      const localX = (e.x * totalPages) - emojiPage;
      return { ...e, x: localX };
    });
  return { emojis: pageEmojis };
}
