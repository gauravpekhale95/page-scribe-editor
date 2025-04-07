
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Plus, FileSymlink } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { format } from 'date-fns';

const VersionListPage: React.FC = () => {
  const navigate = useNavigate();
  const { documentId } = useParams<{ documentId: string }>();
  const { 
    user, 
    documents, 
    versions, 
    setCurrentDocument, 
    setCurrentVersion 
  } = useStore();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Set current document from URL param
  useEffect(() => {
    if (documentId) {
      setCurrentDocument(documentId);
    }
  }, [documentId, setCurrentDocument]);

  const currentDocument = documents.find(doc => doc.id === documentId);
  const documentVersions = versions.filter(version => version.documentId === documentId)
    .sort((a, b) => b.versionNumber - a.versionNumber);

  const handleVersionSelect = (versionId: string) => {
    setCurrentVersion(versionId);
    navigate(`/versions/${versionId}/pages`);
  };

  const handleCreateNewVersion = () => {
    // In a real app, this would likely open a modal or navigate to a creation page
    console.log('Create new version for document:', documentId);
  };

  if (!user || !currentDocument) {
    return null; // Will redirect or handle loading state
  }

  return (
    <MainLayout title={`${currentDocument.name} - Versions`}>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          Document Versions
        </h2>
        <Button onClick={handleCreateNewVersion}>
          <Plus size={16} className="mr-2" /> Create New Version
        </Button>
      </div>

      <div className="bg-white rounded-md shadow overflow-hidden">
        {documentVersions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs uppercase">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-500 font-medium tracking-wider">Version</th>
                  <th className="px-6 py-3 text-left text-gray-500 font-medium tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-gray-500 font-medium tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-gray-500 font-medium tracking-wider">Updated</th>
                  <th className="px-6 py-3 text-right text-gray-500 font-medium tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {documentVersions.map((version) => (
                  <tr 
                    key={version.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleVersionSelect(version.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileSymlink size={18} className="text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900">Version {version.versionNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={version.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {format(new Date(version.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {format(new Date(version.updatedAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Button variant="ghost" size="sm" onClick={(e) => {
                        e.stopPropagation();
                        handleVersionSelect(version.id);
                      }}>
                        View Pages
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500">
              No versions found for this document. 
              Click 'Create New Version' to add one.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default VersionListPage;
