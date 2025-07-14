import { useState } from 'react';
import { Banner, BannerUtils } from '@/core/banner';
import { DecorativeElements } from '@/core/decorative';
import BannerPreview from './BannerPreview';
import BannerControls from './BannerControls';
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
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left Panel - Controls */}
      <div className="lg:w-1/3 space-y-6">
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
      <div className="lg:w-2/3">
        <BannerPreview
          banner={banner}
          selectedElementId={selectedElementId}
          onElementSelect={setSelectedElementId}
        />
      </div>
    </div>
  );
}
