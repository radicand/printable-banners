import React, { useState, useEffect } from 'react';
import {
  FontDetectionResult,
  SystemFont,
  FONT_CATEGORIES,
  FontDetector,
} from '@/core/fonts';

interface FontSelectorProps {
  readonly value: string;
  readonly onChange: (fontFamily: string) => void;
  readonly className?: string;
}

export default function FontSelector({
  value,
  onChange,
  className = '',
}: FontSelectorProps) {
  const [fontDetection, setFontDetection] =
    useState<FontDetectionResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] =
    useState<string>('recommended');

  useEffect(() => {
    const detectFonts = async () => {
      try {
        setIsLoading(true);
        // Add small delay to ensure DOM is ready
        await new Promise((resolve) => setTimeout(resolve, 100));
        const detection = FontDetector.detectAvailableFonts();
        setFontDetection(detection);
      } catch (error) {
        console.error('Font detection failed:', error);
        // Fallback: assume all fonts are available
        setFontDetection({
          available: FONT_CATEGORIES.flatMap((cat) => cat.fonts),
          unavailable: [],
          fallbackMap: {},
        });
      } finally {
        setIsLoading(false);
      }
    };

    detectFonts();
  }, []);

  const getRecommendedFonts = (): SystemFont[] => {
    if (!fontDetection) return [];

    const recommended = [
      'Impact',
      'Arial Black',
      'Franklin Gothic Medium',
      'Georgia',
      'Arial',
      'Verdana',
      'Times New Roman',
      'Trebuchet MS',
    ];

    return fontDetection.available
      .filter((font) => recommended.includes(font.family))
      .sort(
        (a, b) => recommended.indexOf(a.family) - recommended.indexOf(b.family)
      );
  };

  const getFontsByCategory = (categoryId: string): SystemFont[] => {
    if (!fontDetection) return [];

    if (categoryId === 'recommended') {
      return getRecommendedFonts();
    }

    return fontDetection.available.filter(
      (font) => font.category === categoryId
    );
  };

  const getFontPreviewStyle = (
    font: SystemFont | null
  ): React.CSSProperties => {
    if (!font) {
      return { fontFamily: 'sans-serif' };
    }
    return {
      fontFamily: `"${font.family}", ${font.fallbacks.join(', ')}`,
      fontWeight: font.weight || 'normal',
      fontStyle: font.style || 'normal',
    };
  };

  if (isLoading) {
    return (
      <div className={`${className}`}>
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    );
  }

  const categories = [
    {
      id: 'recommended',
      name: 'Recommended',
      description: 'Best fonts for banners',
    },
    ...FONT_CATEGORIES,
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-1">
        {categories.map((category) => {
          const fontsInCategory = getFontsByCategory(category.id);
          if (fontsInCategory.length === 0) return null;

          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name} ({fontsInCategory.length})
            </button>
          );
        })}
      </div>

      {/* Font Selection */}
      <div className="space-y-2">
        <label
          htmlFor="font-family-select"
          className="block text-sm font-medium text-gray-700"
        >
          Font Family
        </label>

        <select
          id="font-family-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          style={getFontPreviewStyle(
            fontDetection?.available.find((f) => f.family === value) || null
          )}
        >
          {getFontsByCategory(selectedCategory).map((font) => (
            <option
              key={font.family}
              value={font.family}
              style={getFontPreviewStyle(font)}
            >
              {font.name}
            </option>
          ))}
        </select>
      </div>

      {/* Font Preview */}
      <div className="bg-gray-50 p-3 rounded-md border">
        <div className="text-sm text-gray-600 mb-2">Preview:</div>
        <div
          className="text-lg font-medium text-gray-900"
          style={getFontPreviewStyle(
            fontDetection?.available.find((f) => f.family === value) || null
          )}
        >
          The Quick Brown Fox Jumps
        </div>
        <div
          className="text-2xl font-bold text-gray-900 mt-1"
          style={getFontPreviewStyle(
            fontDetection?.available.find((f) => f.family === value) || null
          )}
        >
          BANNER TEXT
        </div>
      </div>

      {/* Font Info */}
      {fontDetection && (
        <div className="text-xs text-gray-500">
          {fontDetection.available.length} fonts available,{' '}
          {fontDetection.unavailable.length} unavailable
          {fontDetection.fallbackMap[value] && (
            <div className="mt-1">
              Using fallback: {fontDetection.fallbackMap[value]}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
