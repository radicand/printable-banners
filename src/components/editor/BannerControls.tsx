import { useState } from 'react';
import { Banner, BannerTextElement } from '@/core/banner';
import { BannerPDFGenerator } from '@/core/pdf';

interface BannerControlsProps {
  readonly banner: Banner;
  readonly selectedElementId: string | null;
  readonly onAddText: (text: string) => void;
  readonly onTextUpdate: (
    elementId: string,
    updates: Partial<BannerTextElement>
  ) => void;
  readonly onToggleInkSaver: () => void;
}

export default function BannerControls({
  banner,
  selectedElementId,
  onAddText,
  onTextUpdate,
  onToggleInkSaver,
}: Readonly<BannerControlsProps>) {
  const [newText, setNewText] = useState('');

  const selectedElement = selectedElementId
    ? banner.pages
        .flatMap((p) => p.elements)
        .find((el) => el.id === selectedElementId)
    : null;

  const handleAddText = () => {
    if (newText.trim()) {
      onAddText(newText.trim());
      setNewText('');
    }
  };

  const handleTextChange = (field: keyof BannerTextElement, value: any) => {
    if (selectedElementId) {
      onTextUpdate(selectedElementId, { [field]: value });
    }
  };

  const handlePrintPDF = () => {
    try {
      BannerPDFGenerator.generatePDF(banner, {
        filename: `${banner.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
        download: true,
      });
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handlePreviewPDF = () => {
    try {
      const previewUrl = BannerPDFGenerator.generatePreviewUrl(banner);
      window.open(previewUrl, '_blank');
    } catch (error) {
      console.error('Failed to preview PDF:', error);
      alert('Failed to preview PDF. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner Info */}
      <div className="card p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Banner Info
        </h3>
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-gray-600">Title:</span>{' '}
            <span className="font-medium">{banner.title}</span>
          </div>
          <div>
            <span className="text-gray-600">Size:</span>{' '}
            <span className="font-medium">
              {banner.dimensions.width}" × {banner.dimensions.height}"{' '}
              {banner.dimensions.unit}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Pages:</span>{' '}
            <span className="font-medium">{banner.pages.length}</span>
          </div>
        </div>
      </div>

      {/* Add Text */}
      <div className="card p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Add Text</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Enter your text..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddText();
              }
            }}
          />
          <button
            onClick={handleAddText}
            disabled={!newText.trim()}
            className="w-full btn-primary disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Add Text Element
          </button>
        </div>
      </div>

      {/* Text Element Editor */}
      {selectedElement && (
        <div className="card p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Edit Selected Text
          </h3>
          <div className="space-y-4">
            {/* Text Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Text
              </label>
              <input
                type="text"
                value={selectedElement.text}
                onChange={(e) => handleTextChange('text', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Font Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Font Size: {Math.round(selectedElement.fontSize / 3)}px
              </label>
              <input
                type="range"
                min="12"
                max="200"
                value={selectedElement.fontSize / 3}
                onChange={(e) =>
                  handleTextChange('fontSize', parseInt(e.target.value) * 3)
                }
                className="w-full"
              />
            </div>

            {/* Font Family */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Font Family
              </label>
              <select
                value={selectedElement.fontFamily}
                onChange={(e) => handleTextChange('fontFamily', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Georgia">Georgia</option>
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Impact">Impact</option>
              </select>
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color
              </label>
              <input
                type="color"
                value={selectedElement.color}
                onChange={(e) => handleTextChange('color', e.target.value)}
                className="w-full h-10 border border-gray-300 rounded-md"
              />
            </div>

            {/* Position */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  X Position: {Math.round(selectedElement.x * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={selectedElement.x}
                  onChange={(e) =>
                    handleTextChange('x', parseFloat(e.target.value))
                  }
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Y Position: {Math.round(selectedElement.y * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={selectedElement.y}
                  onChange={(e) =>
                    handleTextChange('y', parseFloat(e.target.value))
                  }
                  className="w-full"
                />
              </div>
            </div>

            {/* Rotation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rotation: {selectedElement.rotation}°
              </label>
              <input
                type="range"
                min="-180"
                max="180"
                value={selectedElement.rotation}
                onChange={(e) =>
                  handleTextChange('rotation', parseInt(e.target.value))
                }
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Banner Options */}
      <div className="card p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Banner Options
        </h3>
        <div className="space-y-3">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={banner.inkSaverMode}
              onChange={onToggleInkSaver}
              className="rounded"
            />
            <span className="text-sm">Ink Saver Mode (outline text)</span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="card p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Actions</h3>
        <div className="space-y-3">
          <button onClick={handlePrintPDF} className="w-full btn-primary">
            Download PDF
          </button>
          <button onClick={handlePreviewPDF} className="w-full btn-secondary">
            Preview PDF
          </button>
        </div>
      </div>
    </div>
  );
}
