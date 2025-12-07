import { useState } from 'react';
import BrandDNAProfileList from './BrandDNAProfileList';
import BrandDNAProfileView from './BrandDNAProfileView';
import BrandDNAWizard from './BrandDNAWizard';

type ViewMode = 'list' | 'view' | 'wizard';

export default function BrandDNASection() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSelectProfile = (brandId: string) => {
    setSelectedBrandId(brandId);
    setViewMode('view');
  };

  const handleCreateNew = () => {
    setSelectedBrandId(null);
    setViewMode('wizard');
  };

  const handleBack = () => {
    setViewMode('list');
    setSelectedBrandId(null);
    // Force refresh when navigating back to list
    setRefreshKey(prev => prev + 1);
  };

  const handleEdit = () => {
    // For now, just show the view - edit functionality can be added later
    // setViewMode('edit');
  };

  if (viewMode === 'wizard') {
    return (
      <BrandDNAWizard
        onComplete={() => {
          setViewMode('list');
          // Force refresh when wizard completes
          setRefreshKey(prev => prev + 1);
        }}
        onCancel={handleBack}
      />
    );
  }

  if (viewMode === 'view' && selectedBrandId) {
    return (
      <BrandDNAProfileView
        brandId={selectedBrandId}
        onBack={handleBack}
        onEdit={handleEdit}
      />
    );
  }

  return (
    <BrandDNAProfileList
      key={refreshKey}
      onSelectProfile={handleSelectProfile}
      onCreateNew={handleCreateNew}
    />
  );
}

