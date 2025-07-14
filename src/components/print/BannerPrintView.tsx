import { Banner, BannerTextElement } from '@/core/banner';

interface BannerPrintViewProps {
  readonly banner: Banner;
}

const PAGE_WIDTH_IN = 11;
const PAGE_HEIGHT_IN = 8.5;
const DPI = 96;
const PAGE_WIDTH_PX = PAGE_WIDTH_IN * DPI;
const PAGE_HEIGHT_PX = PAGE_HEIGHT_IN * DPI;

export default function BannerPrintView({ banner }: BannerPrintViewProps) {
  return (
    <div
      className="print-container"
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: 'max-content',
        height: `${PAGE_HEIGHT_PX}px`,
      }}
    >
      {banner.pages.map((page, pageIndex) => (
        <PrintPage
          key={page.pageNumber}
          page={page}
          pageIndex={pageIndex}
          totalPages={banner.pages.length}
        />
      ))}
    </div>
  );
}

interface PrintPageProps {
  readonly page: any;
  readonly pageIndex: number;
  readonly totalPages: number;
}

function PrintPage({ page, pageIndex, totalPages }: PrintPageProps) {
  return (
    <div
      className="print-page"
      style={{
        width: `${PAGE_WIDTH_PX}px`,
        height: `${PAGE_HEIGHT_PX}px`,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'white',
        border: '1px solid #ccc',
        pageBreakAfter: 'always',
      }}
    >
      {/* Page indicators for debugging */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          fontSize: '12px',
          color: '#666',
          zIndex: 1000,
        }}
      >
        Page {page.pageNumber}
      </div>

      {/* Render text elements that should appear on this page */}
      {page.elements.map((element: BannerTextElement) => (
        <PrintTextElement
          key={element.id}
          element={element}
          pageIndex={pageIndex}
          totalPages={totalPages}
        />
      ))}
    </div>
  );
}

interface PrintTextElementProps {
  readonly element: BannerTextElement;
  readonly pageIndex: number;
  readonly totalPages: number;
}

function PrintTextElement({
  element,
  pageIndex,
  totalPages,
}: PrintTextElementProps) {
  // Calculate position based on the ENTIRE banner width (across all pages)
  // element.x represents position across the full banner width (0 = far left of page 1, 1 = far right of last page)

  const totalBannerWidth = PAGE_WIDTH_PX * totalPages;
  const absoluteX = element.x * totalBannerWidth; // Position across entire banner

  // Calculate position relative to THIS page
  const pageStartX = pageIndex * PAGE_WIDTH_PX;
  const relativeX = absoluteX - pageStartX;

  // Only render if text should appear on this page
  // We need to check if any part of the text would be visible on this page
  // Use a more generous range for large text to ensure proper overlap
  const estimatedTextWidthPercent =
    ((element.fontSize * element.text.length * 0.6) / PAGE_WIDTH_PX) * 100;
  const isLargeText = estimatedTextWidthPercent > 40;

  let visibilityRange = PAGE_WIDTH_PX * 1.5; // More generous default range
  if (isLargeText) {
    visibilityRange = PAGE_WIDTH_PX * 2.0; // Even wider range for large text
  }

  if (
    relativeX < -visibilityRange ||
    relativeX > PAGE_WIDTH_PX + visibilityRange
  ) {
    return null; // Text doesn't appear on this page
  }

  const y = element.y * PAGE_HEIGHT_PX;

  return (
    <div
      style={{
        position: 'absolute',
        left: `${relativeX}px`,
        top: `${y}px`,
        fontSize: `${element.fontSize}px`,
        fontFamily: element.fontFamily,
        color: element.outline ? 'transparent' : element.color,
        WebkitTextStroke: element.outline ? `1px ${element.color}` : 'none',
        fontWeight: 'normal',
        whiteSpace: 'nowrap',
        zIndex: 10,
        transform: `translate(-50%, -50%) rotate(${element.rotation}deg)`,
        pointerEvents: 'none',
      }}
    >
      {element.text}
    </div>
  );
}
