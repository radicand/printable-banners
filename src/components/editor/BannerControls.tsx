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
            id="newText"
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
              <label
                htmlFor="textContent"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Text
              </label>
              <input
                id="textContent"
                type="text"
                value={selectedElement.text}
                onChange={(e) =>
                  onTextUpdate(selectedElement.id, { text: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Font Size */}
            <div>
              <label
                htmlFor="fontSize"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Font Size: {Math.round(selectedElement.fontSize / 3)}px
              </label>
              <input
                id="fontSize"
                type="range"
                min="12"
                max="200"
                value={selectedElement.fontSize / 3}
                onChange={(e) =>
                  onTextUpdate(selectedElement.id, {
                    fontSize: Number(e.target.value) * 3,
                  })
                }
                className="w-full"
              />
            </div>

            {/* Font Family */}
            <div>
              <label
                htmlFor="fontFamily"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Font Family
              </label>
              <select
                id="fontFamily"
                value={selectedElement.fontFamily}
                onChange={(e) =>
                  onTextUpdate(selectedElement.id, {
                    fontFamily: e.target.value,
                  })
                }
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
              <label
                htmlFor="colorPicker"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Color
              </label>
              <input
                id="colorPicker"
                type="color"
                value={selectedElement.color}
                onChange={(e) =>
                  onTextUpdate(selectedElement.id, { color: e.target.value })
                }
                className="w-full h-10 border border-gray-300 rounded-md"
              />
            </div>

            {/* Position */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="xPosition"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  X Position: {Math.round(selectedElement.x * 100)}%
                </label>
                <input
                  id="xPosition"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={selectedElement.x}
                  onChange={(e) =>
                    onTextUpdate(selectedElement.id, {
                      x: Number(e.target.value),
                    })
                  }
                  className="w-full"
                />
              </div>
              <div>
                <label
                  htmlFor="yPosition"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Y Position: {Math.round(selectedElement.y * 100)}%
                </label>
                <input
                  id="yPosition"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={selectedElement.y}
                  onChange={(e) =>
                    onTextUpdate(selectedElement.id, {
                      y: Number(e.target.value),
                    })
                  }
                  className="w-full"
                />
              </div>
            </div>

            {/* Rotation */}
            <div>
              <label
                htmlFor="rotation"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Rotation: {selectedElement.rotation}°
              </label>
              <input
                id="rotation"
                type="range"
                min="-180"
                max="180"
                value={selectedElement.rotation}
                onChange={(e) =>
                  onTextUpdate(selectedElement.id, {
                    rotation: Number(e.target.value),
                  })
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
