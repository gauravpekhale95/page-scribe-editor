
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useStore } from '@/store/useStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { File, Plus } from 'lucide-react';

const PageListPage: React.FC = () => {
  const navigate = useNavigate();
  const { versionId } = useParams<{ versionId: string }>();
  const { 
    user, 
    versions, 
    pages, 
    setCurrentVersion,
    setCurrentPage 
  } = useStore();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Set current version from URL param
  useEffect(() => {
    if (versionId) {
      setCurrentVersion(versionId);
    }
  }, [versionId, setCurrentVersion]);

  const currentVersion = versions.find(v => v.id === versionId);
  const versionPages = pages.filter(p => p.versionId === versionId)
    .sort((a, b) => a.pageNumber - b.pageNumber);

  const handlePageSelect = (pageId: string) => {
    setCurrentPage(pageId);
    navigate(`/pages/${pageId}/editor`);
  };

  const handleAddPage = () => {
    // In a real app, this would likely open a modal or navigate to a creation page
    console.log('Add new page to version:', versionId);
  };

  if (!user || !currentVersion) {
    return null; // Will redirect or handle loading state
  }

  return (
    <MainLayout title={`Version ${currentVersion.versionNumber} - Pages`}>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          Document Pages
        </h2>
        <Button onClick={handleAddPage}>
          <Plus size={16} className="mr-2" /> Add New Page
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {versionPages.map((page) => (
          <Card 
            key={page.id} 
            className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handlePageSelect(page.id)}
          >
            <div className="h-48 bg-gray-100 flex items-center justify-center">
              {page.imageUrl ? (
                <img 
                  src={page.imageUrl} 
                  alt={`Page ${page.pageNumber} preview`} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <File size={48} className="text-gray-400" />
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Page {page.pageNumber}</h3>
                <span className="text-xs text-gray-500">
                  {page.validationRules.length} VRs
                </span>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add Page Card */}
        <Card 
          className="border-dashed border-2 hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer flex items-center justify-center h-full"
          onClick={handleAddPage}
        >
          <CardContent className="p-6 flex flex-col items-center justify-center h-full">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Plus size={24} className="text-primary" />
            </div>
            <p className="text-sm text-gray-600 font-medium">Add New Page</p>
          </CardContent>
        </Card>

        {versionPages.length === 0 && (
          <div className="col-span-full flex items-center justify-center p-8 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500 text-center">
              No pages available for this version. Click 'Add New Page' to create one.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default PageListPage;
