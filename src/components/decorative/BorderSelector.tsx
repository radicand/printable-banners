import {
  BorderElement,
  BorderStyle,
  BORDER_STYLES,
  createDefaultBorder,
} from '../../core/decorative';

interface BorderSelectorProps {
  readonly borders: BorderElement[];
  readonly onBordersChange: (borders: BorderElement[]) => void;
}

export function BorderSelector({
  borders,
  onBordersChange,
}: BorderSelectorProps) {
  const handleAddBorder = (styleId: string) => {
    const newBorder = createDefaultBorder(styleId);
    // Find the full style from BORDER_STYLES
    const fullStyle = BORDER_STYLES.find((s) => s.id === styleId);
    if (fullStyle) {
      newBorder.style = fullStyle;
    }
    onBordersChange([...borders, newBorder]);
  };

  const handleRemoveBorder = (borderId: string) => {
    onBordersChange(borders.filter((b) => b.id !== borderId));
  };

  const handleToggleBorder = (borderId: string) => {
    onBordersChange(
      borders.map((border) =>
        border.id === borderId
          ? { ...border, enabled: !border.enabled }
          : border
      )
    );
  };

  const handlePositionChange = (
    borderId: string,
    position: BorderElement['position']
  ) => {
    onBordersChange(
      borders.map((border) =>
        border.id === borderId ? { ...border, position } : border
      )
    );
  };

  const handleMarginChange = (borderId: string, margin: number) => {
    onBordersChange(
      borders.map((border) =>
        border.id === borderId ? { ...border, margin } : border
      )
    );
  };

  const getStylePreview = (style: BorderStyle) => {
    if (style.type === 'emoji' && style.emoji) {
      return style.emoji.repeat(3);
    }

    const lineStyle =
      style.type === 'dashed'
        ? 'dashed'
        : style.type === 'dotted'
          ? 'dotted'
          : 'solid';

    return (
      <div
        className="w-8 h-1 border-t"
        style={{
          borderStyle: lineStyle,
          borderColor: style.color || '#000000',
          borderWidth: `${Math.max(1, (style.thickness || 1) / 2)}px`,
        }}
      />
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Add Border</h3>
        <div className="grid grid-cols-2 gap-2">
          {BORDER_STYLES.map((style) => (
            <button
              key={style.id}
              onClick={() => handleAddBorder(style.id)}
              className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50 text-left"
            >
              <div className="flex-shrink-0">{getStylePreview(style)}</div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-gray-900 truncate">
                  {style.name}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {style.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {borders.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Active Borders
          </h3>
          <div className="space-y-2">
            {borders.map((border) => (
              <div key={border.id} className="p-3 border rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={border.enabled}
                      onChange={() => handleToggleBorder(border.id)}
                      className="rounded"
                    />
                    <span className="text-sm font-medium">
                      {border.style.name}
                    </span>
                    {getStylePreview(border.style)}
                  </div>
                  <button
                    onClick={() => handleRemoveBorder(border.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label
                      htmlFor={`position-${border.id}`}
                      className="block text-xs text-gray-600 mb-1"
                    >
                      Position
                    </label>
                    <select
                      id={`position-${border.id}`}
                      value={border.position}
                      onChange={(e) =>
                        handlePositionChange(
                          border.id,
                          e.target.value as BorderElement['position']
                        )
                      }
                      className="w-full px-2 py-1 text-xs border rounded"
                    >
                      <option value="all">All sides</option>
                      <option value="top">Top only</option>
                      <option value="bottom">Bottom only</option>
                      <option value="left">Left only</option>
                      <option value="right">Right only</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor={`margin-${border.id}`}
                      className="block text-xs text-gray-600 mb-1"
                    >
                      Margin (inches)
                    </label>
                    <input
                      id={`margin-${border.id}`}
                      type="number"
                      min="0"
                      max="1"
                      step="0.1"
                      value={border.margin}
                      onChange={(e) =>
                        handleMarginChange(border.id, Number(e.target.value))
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
