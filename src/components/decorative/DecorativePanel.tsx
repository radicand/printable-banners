import { useState } from 'react';
import { DecorativeElements } from '../../core/decorative';
import { BorderSelector } from './BorderSelector';
import { EmojiSelector } from './EmojiSelector';

interface DecorativePanelProps {
  readonly decorative: DecorativeElements;
  readonly onDecorativeChange: (decorative: DecorativeElements) => void;
}

export function DecorativePanel({
  decorative,
  onDecorativeChange,
}: DecorativePanelProps) {
  const [activeTab, setActiveTab] = useState<'borders' | 'emojis'>('borders');

  const handleBordersChange = (borders: DecorativeElements['borders']) => {
    onDecorativeChange({
      ...decorative,
      borders,
    });
  };

  const handleEmojisChange = (emojis: DecorativeElements['emojis']) => {
    onDecorativeChange({
      ...decorative,
      emojis,
    });
  };

  return (
    <div className="border rounded-lg p-4 bg-white">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Decorative Elements
      </h2>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-4">
        <button
          onClick={() => setActiveTab('borders')}
          className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'borders'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Borders ({decorative.borders.length})
        </button>
        <button
          onClick={() => setActiveTab('emojis')}
          className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'emojis'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Emojis ({decorative.emojis.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[200px]">
        {activeTab === 'borders' && (
          <BorderSelector
            borders={decorative.borders}
            onBordersChange={handleBordersChange}
          />
        )}
        {activeTab === 'emojis' && (
          <EmojiSelector
            emojis={decorative.emojis}
            onEmojisChange={handleEmojisChange}
          />
        )}
      </div>
    </div>
  );
}
