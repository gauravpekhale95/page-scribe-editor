
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Plus, FileText } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { format } from 'date-fns';

const DocumentListPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useParams<{ state: string }>();
  const { user, documents, setCurrentState, setCurrentDocument } = useStore();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Set current state from URL param
  useEffect(() => {
    if (state) {
      setCurrentState(state);
    }
  }, [state, setCurrentState]);

  const stateDocuments = documents.filter(doc => doc.state === state);

  const handleDocumentSelect = (documentId: string) => {
    setCurrentDocument(documentId);
    navigate(`/documents/${documentId}`);
  };

  const handleAddDocument = () => {
    // In a real app, this would likely open a modal or navigate to a creation page
    console.log('Add new document for state:', state);
  };

  if (!user) {
    return null; // Will redirect
  }

  return (
    <MainLayout title={`${state} Documents`}>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          All Documents
        </h2>
        {user.role === 'cca' && (
          <Button onClick={handleAddDocument}>
            <Plus size={16} className="mr-2" /> Add New Template
          </Button>
        )}
      </div>

      <div className="bg-white rounded-md shadow overflow-hidden">
        {stateDocuments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs uppercase">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-500 font-medium tracking-wider">Document Name</th>
                  <th className="px-6 py-3 text-left text-gray-500 font-medium tracking-wider"># Versions</th>
                  <th className="px-6 py-3 text-left text-gray-500 font-medium tracking-wider">Last Edited</th>
                  <th className="px-6 py-3 text-left text-gray-500 font-medium tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-gray-500 font-medium tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stateDocuments.map((document) => (
                  <tr 
                    key={document.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleDocumentSelect(document.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText size={18} className="text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900">{document.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {document.versionsCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {format(new Date(document.lastEdited), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={document.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Button variant="ghost" size="sm" onClick={(e) => {
                        e.stopPropagation();
                        handleDocumentSelect(document.id);
                      }}>
                        View
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
              No documents found for {state}. 
              {user.role === 'cca' && " Click 'Add New Template' to create one."}
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default DocumentListPage;
