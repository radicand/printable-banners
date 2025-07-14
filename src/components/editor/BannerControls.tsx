// BannerControls renders the landing page, template selection, and editor controls
// This restores the last agent-edited state with correct UI and navigation logic
import React, { useState } from 'react';
import { BannerPDFGenerator } from '@/core/pdf';
import FontSelector from '../fonts/FontSelector';
import { TemplateManager } from '@/core/template';

interface BannerControlsProps {
  onSelectTemplate: (templateId: string) => void;
  onStartBlank: () => void;
  banner?: any; // Adjust the type according to your banner object shape
}

export const BannerControls: React.FC<BannerControlsProps> = ({
  onSelectTemplate,
  onStartBlank,
  banner,
}) => {
  const [newText, setNewText] = useState('');

  // Show landing page if no banner is loaded
  if (!banner) {
    const templates = TemplateManager.getAllTemplates();
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-pink-50">
        <h1 className="text-4xl font-bold mb-6">Create Your Perfect Banner</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
          {templates.map((template) => (
            <button
              key={template.id}
              className="bg-white rounded-lg shadow-md p-6 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={() => onSelectTemplate(template.id)}
              aria-label={`Select ${template.name} template`}
            >
              <span className="font-semibold">{template.name}</span>
            </button>
          ))}
          <button
            className="bg-white rounded-lg shadow-md p-6 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-400"
            onClick={onStartBlank}
            aria-label="Select Blank Banner template"
          >
            <span className="text-2xl mb-2 block">➕</span>
            <span className="font-semibold">Blank Banner</span>
          </button>
        </div>
      </div>
    );
  }

  const selectedElementId = null;

  const selectedElement = selectedElementId
    ? (banner.pages
        .flatMap((p: { elements: any[] }) => p.elements)
        .find((el: any) => el.id === selectedElementId))
    : null;

  const handleAddText = () => {
    if (newText.trim()) {
      // onAddText(newText.trim());
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
                onChange={(_e) =>
                  // onTextUpdate(selectedElement.id, { text: e.target.value })
                  null
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
                  // onTextUpdate(selectedElement.id, {
                  //   fontSize: Number(e.target.value) * 3,
                  // })
                  null
                }
                className="w-full"
              />
            </div>

            {/* Font Family */}
            <FontSelector
              value={selectedElement.fontFamily}
              onChange={(_fontFamily) =>
                // onTextUpdate(selectedElement.id, { fontFamily })
                null
              }
            />

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
                onChange={(_e) =>
                  // onTextUpdate(selectedElement.id, { color: e.target.value })
                  null
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
                  onChange={(_e) =>
                    // onTextUpdate(selectedElement.id, { x: Number(e.target.value) })
                    null
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
                  onChange={(_e) =>
                    // onTextUpdate(selectedElement.id, { y: Number(e.target.value) })
                    null
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
                onChange={(_e) =>
                  // onTextUpdate(selectedElement.id, { rotation: Number(e.target.value) })
                  null
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
              // onChange={onToggleInkSaver}
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
};
