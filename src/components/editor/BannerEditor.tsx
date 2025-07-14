import { useState } from 'react';
import { Banner, BannerUtils } from '@/core/banner';
import { DecorativeElements } from '@/core/decorative';
import BannerPreview from './BannerPreview';
import { BannerControls } from './BannerControls';
import { DecorativePanel } from '../decorative';

interface BannerEditorProps {
  readonly banner: Banner;
  readonly onBannerUpdate: (banner: Banner) => void;
  readonly onBack: () => void;
}

export default function BannerEditor({
  banner,
  onBannerUpdate,
  onBack,
}: BannerEditorProps) {
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null
  );

  const handleAddText = (text: string) => {
    const updatedBanner = BannerUtils.addTextElement(banner, text);
    onBannerUpdate(updatedBanner);
  };

  const handleTextUpdate = (elementId: string, updates: any) => {
    const updatedBanner = BannerUtils.updateTextElement(
      banner,
      elementId,
      updates
    );
    onBannerUpdate(updatedBanner);
  };

  const handleToggleInkSaver = () => {
    const updatedBanner = BannerUtils.toggleInkSaverMode(banner);
    onBannerUpdate(updatedBanner);
  };

  const handleDecorativeChange = (decorative: DecorativeElements) => {
    const updatedBanner = { ...banner, decorative };
    onBannerUpdate(updatedBanner);
  };

  return (
    <div
      className="flex flex-col gap-6 lg:grid lg:grid-cols-[340px_1fr] lg:gap-8"
      data-testid="banner-editor"
    >
      {/* Left Panel - Controls */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="btn-secondary">
            ← Back to Templates
          </button>
        </div>

        <BannerControls
          banner={banner}
          selectedElementId={selectedElementId}
          onAddText={handleAddText}
          onTextUpdate={handleTextUpdate}
          onToggleInkSaver={handleToggleInkSaver}
        />

        <DecorativePanel
          decorative={banner.decorative}
          onDecorativeChange={handleDecorativeChange}
        />
      </div>

      {/* Right Panel - Preview */}
      <div className="relative">
        <div
          className="lg:sticky lg:top-20 w-full"
          style={{
            maxWidth: 'calc(100vw - 340px - 32px - 32px)', // 340px sidebar + 32px gap + 32px container padding
            overflowX: 'auto',
          }}
        >
          <BannerPreview
            banner={banner}
            selectedElementId={selectedElementId}
            onElementSelect={setSelectedElementId}
          />
        </div>
      </div>
    </div>
  );
}
