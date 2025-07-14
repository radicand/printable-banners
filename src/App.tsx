import { useState } from 'react';
import { Banner } from '@/core/banner';
import { TemplateManager } from '@/core/template';
import BannerEditor from '@/components/editor/BannerEditor';
import TemplateSelector from '@/components/templates/TemplateSelector';
import Header from '@/components/ui/Header';

function App() {
  const [currentBanner, setCurrentBanner] = useState<Banner | null>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(true);

  const handleTemplateSelect = (templateId: string) => {
    try {
      const banner = TemplateManager.createBannerFromTemplate(templateId);
      setCurrentBanner(banner);
      setShowTemplateSelector(false);
    } catch (error) {
      console.error('Failed to create banner from template:', error);
    }
  };

  const handleNewBanner = () => {
    setCurrentBanner(null);
    setShowTemplateSelector(true);
  };

  const handleBannerUpdate = (updatedBanner: Banner) => {
    setCurrentBanner(updatedBanner);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNewBanner={handleNewBanner} />

      <main className="container mx-auto px-4 py-8">
        {showTemplateSelector ? (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Create Your Perfect Banner
              </h1>
              <p className="text-lg text-gray-600">
                Choose a template to get started, or create a custom banner from
                scratch
              </p>
            </div>
            <TemplateSelector onSelectTemplate={handleTemplateSelect} />
          </div>
        ) : currentBanner ? (
          <BannerEditor
            banner={currentBanner}
            onBannerUpdate={handleBannerUpdate}
            onBack={() => setShowTemplateSelector(true)}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No banner selected</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
