import React from 'react';
import {
  DecorativeElements,
  calculateBorderPaths,
  BorderPath,
  calculateDecorativeLayout,
} from '../../core/decorative';
import { BannerDimensions } from '../../core/banner';

interface DecorativePreviewProps {
  readonly decorative: DecorativeElements;
  readonly dimensions: BannerDimensions;
  readonly containerWidth: number;
  readonly containerHeight: number;
  readonly inkSaverMode: boolean;
  readonly pageIndex: number;
  readonly totalPages: number;
}

export function DecorativePreview({
  decorative,
  dimensions,
  containerWidth,
  containerHeight,
  inkSaverMode,
  pageIndex,
  totalPages,
}: DecorativePreviewProps) {
  const scaleFactor =
    containerWidth /
    (dimensions.unit === 'in' ? dimensions.width * 72 : dimensions.width);

  /**
   * Calculate which borders to show for this specific page
   */
  const calculatePageBorders = (
    border: DecorativeElements['borders'][0]
  ): BorderPath[] => {
    const isFirstPage = pageIndex === 0;
    const isLastPage = pageIndex === totalPages - 1;

    // For single page banners, show all borders
    if (totalPages === 1) {
      return calculateBorderPaths(border, { dimensions, inkSaverMode });
    }

    // For multi-page banners, only show appropriate borders
    const paths: BorderPath[] = [];
    const { style } = border;

    // Convert dimensions to pixels
    const width =
      dimensions.unit === 'in' ? dimensions.width * 72 : dimensions.width;
    const height =
      dimensions.unit === 'in' ? dimensions.height * 72 : dimensions.height;
    const fullMargin =
      dimensions.unit === 'in' ? border.margin * 72 : border.margin; // Convert margin to pixels

    // Always show top and bottom borders on all pages
    if (border.position === 'top' || border.position === 'all') {
      // Always use full margin for top borders
      const topMargin = fullMargin;
      paths.push(...createBorderPaths(style, width, height, topMargin, 'top'));
    }

    if (border.position === 'bottom' || border.position === 'all') {
      // Always use full margin for bottom borders
      const bottomMargin = fullMargin;
      paths.push(
        ...createBorderPaths(style, width, height, bottomMargin, 'bottom')
      );
    }

    // Only show left border on first page
    if (
      (border.position === 'left' || border.position === 'all') &&
      isFirstPage
    ) {
      paths.push(
        ...createBorderPaths(style, width, height, fullMargin, 'left')
      );
    }

    // Only show right border on last page
    if (
      (border.position === 'right' || border.position === 'all') &&
      isLastPage
    ) {
      paths.push(
        ...createBorderPaths(style, width, height, fullMargin, 'right')
      );
    }

    return paths;
  };

  /**
   * Create border paths for a specific position (preview version)
   */
  const createBorderPaths = (
    style: DecorativeElements['borders'][0]['style'],
    width: number,
    height: number,
    margin: number,
    position: 'top' | 'bottom' | 'left' | 'right'
  ): BorderPath[] => {
    if (style.type === 'emoji' && style.emoji) {
      return createEmojiBorderPaths(style, width, height, margin, position);
    } else {
      return createLineBorderPaths(style, width, height, margin, position);
    }
  };

  /**
   * Create line-based border paths for preview
   */
  const createLineBorderPaths = (
    style: DecorativeElements['borders'][0]['style'],
    width: number,
    height: number,
    margin: number,
    position: 'top' | 'bottom' | 'left' | 'right'
  ): BorderPath[] => {
    const dashArray =
      style.type === 'dashed'
        ? [5, 5]
        : style.type === 'dotted'
          ? [2, 3]
          : undefined;

    switch (position) {
      case 'top':
        return [
          {
            type: 'line',
            x1: margin,
            y1: margin,
            x2: width - margin,
            y2: margin,
            color: style.color || '#000000',
            thickness: style.thickness || 1,
            dashArray,
          },
        ];
      case 'bottom':
        return [
          {
            type: 'line',
            x1: margin,
            y1: height - margin,
            x2: width - margin,
            y2: height - margin,
            color: style.color || '#000000',
            thickness: style.thickness || 1,
            dashArray,
          },
        ];
      case 'left':
        return [
          {
            type: 'line',
            x1: margin,
            y1: margin,
            x2: margin,
            y2: height - margin,
            color: style.color || '#000000',
            thickness: style.thickness || 1,
            dashArray,
          },
        ];
      case 'right':
        return [
          {
            type: 'line',
            x1: width - margin,
            y1: margin,
            x2: width - margin,
            y2: height - margin,
            color: style.color || '#000000',
            thickness: style.thickness || 1,
            dashArray,
          },
        ];
      default:
        return [];
    }
  };

  /**
   * Create emoji-based border paths for preview
   */
  const createEmojiBorderPaths = (
    style: DecorativeElements['borders'][0]['style'],
    width: number,
    height: number,
    margin: number,
    position: 'top' | 'bottom' | 'left' | 'right'
  ): BorderPath[] => {
    const paths: BorderPath[] = [];

    if (!style.emoji || !style.spacing) return paths;

    const spacing = style.spacing;
    const size = 16; // Default emoji size

    // For multi-page banners, determine if we need to respect left/right margins
    const isFirstPage = pageIndex === 0;
    const isLastPage = pageIndex === totalPages - 1;
    const isMultiPage = totalPages > 1;

    switch (position) {
      case 'top': {
        // For multi-page banners, respect margins on first/last pages for left/right edges
        let startX = 0;
        let endX = width;

        if (isMultiPage) {
          // On first page, respect left margin
          if (isFirstPage) {
            startX = margin;
          }
          // On last page, respect right margin
          if (isLastPage) {
            endX = width - margin;
          }
        } else {
          // Single page: respect both margins
          startX = margin;
          endX = width - margin;
        }

        const count = Math.floor((endX - startX) / spacing);
        for (let i = 0; i < count; i++) {
          paths.push({
            type: 'emoji',
            emoji: style.emoji,
            x: startX + i * spacing, // Start from appropriate edge
            y: margin,
            size,
          });
        }
        break;
      }
      case 'bottom': {
        // For multi-page banners, respect margins on first/last pages for left/right edges
        let startX = 0;
        let endX = width;

        if (isMultiPage) {
          // On first page, respect left margin
          if (isFirstPage) {
            startX = margin;
          }
          // On last page, respect right margin
          if (isLastPage) {
            endX = width - margin;
          }
        } else {
          // Single page: respect both margins
          startX = margin;
          endX = width - margin;
        }

        const count = Math.floor((endX - startX) / spacing);
        for (let i = 0; i < count; i++) {
          paths.push({
            type: 'emoji',
            emoji: style.emoji,
            x: startX + i * spacing, // Start from appropriate edge
            y: height - margin,
            size,
          });
        }
        break;
      }
      case 'left': {
        const count = Math.floor((height - 2 * margin) / spacing);
        for (let i = 0; i < count; i++) {
          paths.push({
            type: 'emoji',
            emoji: style.emoji,
            x: margin,
            y: margin + i * spacing,
            size,
          });
        }
        break;
      }
      case 'right': {
        const count = Math.floor((height - 2 * margin) / spacing);
        for (let i = 0; i < count; i++) {
          paths.push({
            type: 'emoji',
            emoji: style.emoji,
            x: width - margin,
            y: margin + i * spacing,
            size,
          });
        }
        break;
      }
    }

    return paths;
  };

  const renderBorderPath = (path: BorderPath, index: number) => {
    if (path.type === 'image' && path.dataUrl && path.width && path.height) {
      return (
        <img
          key={index}
          src={path.dataUrl}
          className="absolute"
          style={{
            left: `${(path.x || 0) * scaleFactor}px`,
            top: `${(path.y || 0) * scaleFactor}px`,
            width: `${path.width * scaleFactor}px`,
            height: `${path.height * scaleFactor}px`,
            pointerEvents: 'none',
          }}
          alt="emoji border"
        />
      );
    } else if (path.type === 'emoji' && path.emoji) {
      return (
        <div
          key={index}
          className="absolute"
          style={{
            left: `${(path.x || 0) * scaleFactor}px`,
            top: `${(path.y || 0) * scaleFactor}px`,
            fontSize: `${(path.size || 16) * scaleFactor}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {path.emoji}
        </div>
      );
    } else if (path.type === 'line' && path.x1 !== undefined) {
      const lineStyle: React.CSSProperties = {
        position: 'absolute',
        left: `${path.x1 * scaleFactor}px`,
        top: `${path.y1! * scaleFactor}px`,
        width: `${(path.x2! - path.x1) * scaleFactor}px`,
        height: `${Math.max(1, (path.thickness || 1) * scaleFactor)}px`,
        backgroundColor: path.color || '#000000',
        transformOrigin: '0 0',
      };

      // Calculate rotation for non-horizontal lines
      if (path.y2 !== undefined && path.y2 !== path.y1) {
        const dx = path.x2! - path.x1;
        const dy = path.y2 - path.y1!;
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        const length = Math.sqrt(dx * dx + dy * dy) * scaleFactor;

        lineStyle.width = `${length}px`;
        lineStyle.transform = `rotate(${angle}deg)`;
      }

      // Handle dashed/dotted styles
      if (path.dashArray) {
        const scaledDashArray = path.dashArray.map((d) => d * scaleFactor);
        return (
          <div
            key={index}
            style={{
              ...lineStyle,
              background: `repeating-linear-gradient(
                                to right,
                                ${path.color || '#000000'} 0px,
                                ${path.color || '#000000'} ${scaledDashArray[0]}px,
                                transparent ${scaledDashArray[0]}px,
                                transparent ${scaledDashArray[0] + scaledDashArray[1]}px
                            )`,
            }}
          />
        );
      }

      return <div key={index} style={lineStyle} />;
    }
    return null;
  };

  // Calculate emoji layout using pure utility
  const { emojis: positionedEmojis } = calculateDecorativeLayout({
    decorative,
    dimensions,
    containerWidth,
    containerHeight,
    pageIndex,
    totalPages,
  });

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Render borders */}
      {decorative.borders
        .filter((border) => border.enabled)
        .map((border) => {
          const paths = calculatePageBorders(border);
          return paths.map((path, pathIndex) =>
            renderBorderPath(path, pathIndex)
          );
        })
        .flat()}

      {/* Render individual emojis using layout utility */}
      {positionedEmojis.map((emoji, index) => (
        <div
          key={`emoji-${index}`}
          className="absolute"
          style={{
            left: `${emoji.x * containerWidth}px`,
            top: `${emoji.y * containerHeight}px`,
            fontSize: `${emoji.size * scaleFactor}px`,
            transform: `translate(-50%, -50%) rotate(${emoji.rotation}deg)`,
            zIndex: 5,
          }}
        >
          {emoji.emoji}
        </div>
      ))}
    </div>
  );
}
