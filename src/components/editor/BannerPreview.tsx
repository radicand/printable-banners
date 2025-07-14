import { Banner, BannerTextElement } from '@/core/banner';
import { DecorativePreview } from '../decorative';

interface BannerPreviewProps {
  readonly banner: Banner;
  readonly selectedElementId: string | null;
  readonly onElementSelect: (elementId: string | null) => void;
}

export default function BannerPreview({
  banner,
  selectedElementId,
  onElementSelect,
}: BannerPreviewProps) {
  const handleElementClick = (elementId: string) => {
    onElementSelect(selectedElementId === elementId ? null : elementId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Preview</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            {banner.inkSaverMode ? 'Ink Saver Mode' : 'Normal Mode'}
          </span>
          <div
            className={`w-3 h-3 rounded-full ${
              banner.inkSaverMode ? 'bg-green-500' : 'bg-gray-400'
            }`}
          />
        </div>
      </div>

      <div className="card p-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-x-auto">
          <div className="flex min-w-max">
            {banner.pages.map((page, index) => (
              <BannerPagePreview
                key={page.pageNumber}
                page={page}
                pageIndex={index}
                totalPages={banner.pages.length}
                selectedElementId={selectedElementId}
                onElementClick={handleElementClick}
                banner={banner}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-600">
        <p>
          Banner Dimensions: {banner.dimensions.width}" ×{' '}
          {banner.dimensions.height}" {banner.dimensions.unit}
        </p>
        <p>Total Pages: {banner.pages.length}</p>
      </div>
    </div>
  );
}

interface BannerPagePreviewProps {
  readonly page: any;
  readonly pageIndex: number;
  readonly totalPages: number;
  readonly selectedElementId: string | null;
  readonly onElementClick: (elementId: string) => void;
  readonly banner: Banner; // Add full banner for decorative elements
}

function BannerPagePreview({
  page,
  pageIndex,
  totalPages,
  selectedElementId,
  onElementClick,
  banner,
}: BannerPagePreviewProps) {
  // For landscape orientation: width = 11", height = 8.5"
  const aspectRatio = 11 / 8.5; // Landscape aspect ratio
  const containerHeight = 200; // Fixed height for preview
  const containerWidth = containerHeight * aspectRatio; // Calculate width to maintain landscape ratio

  return (
    <div
      className="relative bg-white border-l border-t border-b border-gray-200 shadow-sm flex-shrink-0 first:border-l last:border-r"
      style={{
        width: `${containerWidth}px`,
        height: `${containerHeight}px`,
      }}
    >
      {/* Decorative elements */}
      <DecorativePreview
        decorative={banner.decorative}
        dimensions={banner.dimensions}
        containerWidth={containerWidth}
        containerHeight={containerHeight}
        inkSaverMode={banner.inkSaverMode}
        pageIndex={pageIndex}
        totalPages={totalPages}
      />

      {/* Page number indicator */}
      <div className="absolute top-2 left-2 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded z-10">
        Page {page.pageNumber}
      </div>

      {/* Page size indicator */}
      <div className="absolute bottom-2 right-2 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded z-10">
        11" × 8.5"
      </div>

      {/* Text elements - now positioned relative to total banner width */}
      {page.elements.map((element: BannerTextElement) => (
        <TextElementPreview
          key={element.id}
          element={element}
          isSelected={selectedElementId === element.id}
          containerWidth={containerWidth}
          containerHeight={containerHeight}
          pageIndex={pageIndex}
          totalPages={totalPages}
          onClick={() => onElementClick(element.id)}
        />
      ))}
    </div>
  );
}

interface TextElementPreviewProps {
  readonly element: BannerTextElement;
  readonly isSelected: boolean;
  readonly containerWidth: number;
  readonly containerHeight: number;
  readonly pageIndex: number;
  readonly totalPages: number;
  readonly onClick: () => void;
}

function TextElementPreview({
  element,
  isSelected,
  containerWidth,
  containerHeight,
  pageIndex,
  totalPages,
  onClick,
}: TextElementPreviewProps) {
  // Calculate position based on the ENTIRE banner width (across all pages)
  // element.x represents position across the full banner width (0 = far left of page 1, 1 = far right of last page)

  const totalBannerWidth = containerWidth * totalPages;
  const absoluteX = element.x * totalBannerWidth; // Position across entire banner

  // Calculate position relative to THIS page
  const pageStartX = pageIndex * containerWidth;
  const relativeX = absoluteX - pageStartX;

  // Only render if text should appear on this page
  // We need to check if any part of the text would be visible on this page
  // Use a more generous range for large text to match print logic
  const estimatedTextWidthPercent =
    ((element.fontSize * element.text.length * 0.6) / 792) * 100;
  const isLargeText = estimatedTextWidthPercent > 40;

  let visibilityRange = containerWidth * 1.5; // More generous default range
  if (isLargeText) {
    visibilityRange = containerWidth * 2.0; // Even wider range for large text
  }

  if (
    relativeX < -visibilityRange ||
    relativeX > containerWidth + visibilityRange
  ) {
    return null; // Text doesn't appear on this page
  }

  const y = element.y * containerHeight;

  // Scale font size for preview (scale down from print size to UI size)
  const scaleFactor = containerWidth / 800; // Assuming 800px as reference width
  const previewFontSize = element.fontSize * scaleFactor; // fontSize is already print size, just scale for preview

  return (
    <button
      className={`absolute cursor-pointer transition-all duration-200 bg-transparent border-none p-0 whitespace-nowrap ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
      }`}
      style={{
        left: `${relativeX}px`,
        top: `${y}px`,
        transform: `translate(-50%, -50%) rotate(${element.rotation}deg)`,
        fontSize: `${previewFontSize}px`,
        fontFamily: element.fontFamily,
        color: element.outline ? 'transparent' : element.color,
        WebkitTextStroke: element.outline ? `1px ${element.color}` : 'none',
        zIndex: 10, // Ensure text appears above page boundaries
      }}
      onClick={onClick}
      type="button"
      aria-label={`Edit text element: ${element.text}`}
    >
      {element.text}
    </button>
  );
}
