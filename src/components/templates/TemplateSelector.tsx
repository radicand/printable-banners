import { BannerTemplate, TemplateManager } from '@/core/template';

interface TemplateSelectorProps {
  onSelectTemplate: (templateId: string) => void;
}

interface TemplateCardProps {
  template: BannerTemplate;
  onSelect: () => void;
}

export default function TemplateSelector({
  onSelectTemplate,
}: Readonly<TemplateSelectorProps>) {
  const templates = TemplateManager.getAllTemplates();
  const categories = TemplateManager.getCategories();

  return (
    <div className="space-y-8">
      {categories.map((category) => (
        <div key={category.id} className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            {category.name}{' '}
            <span className="text-sm text-gray-500">({category.count})</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates
              .filter((template) => template.category === category.id)
              .map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onSelect={() => onSelectTemplate(template.id)}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TemplateCard({ template, onSelect }: Readonly<TemplateCardProps>) {
  return (
    <div
      className="card p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer text-left w-full"
      onClick={onSelect}
      aria-label={`Select ${template.name} template`}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
        {template.defaultText.length > 0 ? (
          <div className="text-center">
            {template.defaultText.map((text, index) => (
              <div
                key={`${template.id}-text-${index}`}
                className="text-xs font-bold text-gray-600 mb-1"
                style={{ fontSize: '8px' }}
              >
                {text}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400 text-sm">Blank Template</div>
        )}
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {template.name}
      </h3>

      <p className="text-sm text-gray-600 mb-4">{template.description}</p>

      <button
        className="w-full btn-primary"
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        Use This Template
      </button>
    </div>
  );
}
