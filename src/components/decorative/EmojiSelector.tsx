import { EmojiElement, EMOJI_CATEGORIES } from '../../core/decorative';

interface EmojiSelectorProps {
  readonly emojis: EmojiElement[];
  readonly onEmojisChange: (emojis: EmojiElement[]) => void;
}

export function EmojiSelector({ emojis, onEmojisChange }: EmojiSelectorProps) {
  const handleAddEmoji = (emoji: string) => {
    const newEmoji: EmojiElement = {
      id: `emoji-${Date.now()}`,
      emoji,
      x: 50, // Center horizontally (percentage)
      y: 20, // Top area (percentage)
      size: 48, // Default size (doubled from 24)
      rotation: 0,
    };
    onEmojisChange([...emojis, newEmoji]);
  };

  const handleRemoveEmoji = (emojiId: string) => {
    onEmojisChange(emojis.filter((e) => e.id !== emojiId));
  };

  const handleEmojiChange = (
    emojiId: string,
    updates: Partial<EmojiElement>
  ) => {
    onEmojisChange(
      emojis.map((emoji) =>
        emoji.id === emojiId ? { ...emoji, ...updates } : emoji
      )
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Add Emoji</h3>
        {Object.entries(EMOJI_CATEGORIES).map(([category, categoryEmojis]) => (
          <div key={category} className="mb-3">
            <h4 className="text-xs font-medium text-gray-600 mb-1 capitalize">
              {category}
            </h4>
            <div className="flex flex-wrap gap-1">
              {categoryEmojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleAddEmoji(emoji)}
                  className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-50 text-lg"
                  title={`Add ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {emojis.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Placed Emojis
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {emojis.map((emoji) => (
              <div key={emoji.id} className="p-3 border rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{emoji.emoji}</span>
                    <span className="text-sm text-gray-600">
                      {emoji.x}%, {emoji.y}%
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveEmoji(emoji.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label
                      htmlFor={`emoji-x-${emoji.id}`}
                      className="block text-xs text-gray-600 mb-1"
                    >
                      X Position (%)
                    </label>
                    <input
                      id={`emoji-x-${emoji.id}`}
                      type="number"
                      min="0"
                      max="100"
                      value={emoji.x}
                      onChange={(e) =>
                        handleEmojiChange(emoji.id, {
                          x: Number(e.target.value),
                        })
                      }
                      className="w-full px-2 py-1 text-xs border rounded"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`emoji-y-${emoji.id}`}
                      className="block text-xs text-gray-600 mb-1"
                    >
                      Y Position (%)
                    </label>
                    <input
                      id={`emoji-y-${emoji.id}`}
                      type="number"
                      min="0"
                      max="100"
                      value={emoji.y}
                      onChange={(e) =>
                        handleEmojiChange(emoji.id, {
                          y: Number(e.target.value),
                        })
                      }
                      className="w-full px-2 py-1 text-xs border rounded"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`emoji-size-${emoji.id}`}
                      className="block text-xs text-gray-600 mb-1"
                    >
                      Size (px)
                    </label>
                    <input
                      id={`emoji-size-${emoji.id}`}
                      type="number"
                      min="12"
                      max="72"
                      value={emoji.size}
                      onChange={(e) =>
                        handleEmojiChange(emoji.id, {
                          size: Number(e.target.value),
                        })
                      }
                      className="w-full px-2 py-1 text-xs border rounded"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`emoji-rotation-${emoji.id}`}
                      className="block text-xs text-gray-600 mb-1"
                    >
                      Rotation (°)
                    </label>
                    <input
                      id={`emoji-rotation-${emoji.id}`}
                      type="number"
                      min="0"
                      max="360"
                      value={emoji.rotation}
                      onChange={(e) =>
                        handleEmojiChange(emoji.id, {
                          rotation: Number(e.target.value),
                        })
                      }
                      className="w-full px-2 py-1 text-xs border rounded"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
