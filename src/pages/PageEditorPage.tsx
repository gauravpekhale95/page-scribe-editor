
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Check, X, ZoomIn, ZoomOut, Save, ArrowLeft, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import Editor from '@monaco-editor/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ValidationRule } from '@/store/useStore';

const PageEditorPage: React.FC = () => {
  const navigate = useNavigate();
  const { pageId } = useParams<{ pageId: string }>();
  const { 
    user, 
    pages, 
    setCurrentPage 
  } = useStore();

  const [zoomLevel, setZoomLevel] = useState(100);
  const [jsonContent, setJsonContent] = useState('');
  const [validationRules, setValidationRules] = useState<ValidationRule[]>([]);
  const [activeTab, setActiveTab] = useState('form'); // 'form' or 'raw'

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Set current page from URL param and load page data
  useEffect(() => {
    if (pageId) {
      setCurrentPage(pageId);
      
      const currentPage = pages.find(p => p.id === pageId);
      if (currentPage) {
        setJsonContent(JSON.stringify(currentPage.json, null, 2));
        setValidationRules([...currentPage.validationRules]);
      }
    }
  }, [pageId, pages, setCurrentPage]);

  const currentPage = pages.find(p => p.id === pageId);

  const handleSave = () => {
    // In a real app, this would save to an API
    toast.success('Changes saved successfully');
  };

  const handleApprove = () => {
    // In a real app, this would update the status via API
    toast.success('Page approved');
  };

  const handleReject = () => {
    // In a real app, this would update the status via API
    toast.error('Page rejected');
  };

  const handleJsonChange = (value: string | undefined) => {
    if (value) {
      setJsonContent(value);
    }
  };

  const handleValidationRuleChange = (index: number, field: keyof ValidationRule, value: string) => {
    const updatedRules = [...validationRules];
    updatedRules[index] = {
      ...updatedRules[index],
      [field]: value
    };
    setValidationRules(updatedRules);
  };

  const handleAddValidationRule = () => {
    if (!currentPage) return;
    
    const newRule: ValidationRule = {
      id: `new-rule-${Date.now()}`,
      pageId: currentPage.id,
      description: 'New validation rule',
      field: '',
      rule: ''
    };
    
    setValidationRules([...validationRules, newRule]);
  };

  const handleRemoveValidationRule = (index: number) => {
    const updatedRules = [...validationRules];
    updatedRules.splice(index, 1);
    setValidationRules(updatedRules);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 10, 50));
  };

  if (!user || !currentPage) {
    return null; // Will redirect or handle loading state
  }

  const canEdit = user.role === 'cca';
  const canApprove = user.role === 'dev';

  return (
    <MainLayout title={`Page ${currentPage.pageNumber} Editor`}>
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center">
          <Button variant="outline" size="sm" className="mr-3" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} className="mr-1" /> Back
          </Button>
          <h2 className="text-2xl font-semibold text-gray-800">
            Page Editor
          </h2>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleSave}>
            <Save size={16} className="mr-2" /> Save
          </Button>
          {canApprove && (
            <>
              <Button variant="outline" className="border-red-500 hover:bg-red-50 text-red-500" onClick={handleReject}>
                <X size={16} className="mr-2" /> Reject
              </Button>
              <Button variant="outline" className="border-green-500 hover:bg-green-50 text-green-500" onClick={handleApprove}>
                <Check size={16} className="mr-2" /> Approve
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left side: Page Image Viewer */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
            <h3 className="font-medium">Page Image</h3>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={handleZoomOut}>
                <ZoomOut size={16} />
              </Button>
              <span className="text-sm font-medium">{zoomLevel}%</span>
              <Button variant="ghost" size="icon" onClick={handleZoomIn}>
                <ZoomIn size={16} />
              </Button>
            </div>
          </div>
          <div className="h-[calc(100vh-300px)] overflow-auto flex items-center justify-center bg-gray-100 p-4">
            <div style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center' }}>
              {currentPage.imageUrl ? (
                <img 
                  src={currentPage.imageUrl} 
                  alt={`Page ${currentPage.pageNumber}`}
                  className="max-w-full shadow-lg"
                />
              ) : (
                <div className="w-[612px] h-[792px] bg-white shadow-lg flex items-center justify-center">
                  <p className="text-gray-400">No page image available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right side: JSON Editor and VRs */}
        <div className="flex flex-col gap-6">
          {/* JSON Editor */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>JSON Editor</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="form">Form View</TabsTrigger>
                  <TabsTrigger value="raw">Raw JSON</TabsTrigger>
                </TabsList>
                <TabsContent value="form">
                  <p className="text-sm text-gray-500 mb-4">
                    Form view is not implemented in this demo. Switch to Raw JSON to edit.
                  </p>
                </TabsContent>
                <TabsContent value="raw" className="h-[300px] border rounded-md">
                  <Editor
                    height="300px"
                    defaultLanguage="json"
                    value={jsonContent}
                    onChange={handleJsonChange}
                    options={{
                      minimap: { enabled: false },
                      readOnly: !canEdit
                    }}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Validation Rules */}
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle>Validation Rules</CardTitle>
              {canEdit && (
                <Button variant="outline" size="sm" onClick={handleAddValidationRule}>
                  <Plus size={14} className="mr-1" /> Add Rule
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rule</th>
                      {canEdit && (
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {validationRules.map((rule, index) => (
                      <tr key={rule.id}>
                        <td className="px-4 py-2">
                          {canEdit ? (
                            <input
                              type="text"
                              value={rule.description}
                              onChange={(e) => handleValidationRuleChange(index, 'description', e.target.value)}
                              className="w-full border rounded px-2 py-1 text-sm"
                            />
                          ) : (
                            <span className="text-sm">{rule.description}</span>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          {canEdit ? (
                            <input
                              type="text"
                              value={rule.field}
                              onChange={(e) => handleValidationRuleChange(index, 'field', e.target.value)}
                              className="w-full border rounded px-2 py-1 text-sm"
                            />
                          ) : (
                            <span className="text-sm">{rule.field}</span>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          {canEdit ? (
                            <input
                              type="text"
                              value={rule.rule}
                              onChange={(e) => handleValidationRuleChange(index, 'rule', e.target.value)}
                              className="w-full border rounded px-2 py-1 text-sm"
                            />
                          ) : (
                            <span className="text-sm">{rule.rule}</span>
                          )}
                        </td>
                        {canEdit && (
                          <td className="px-4 py-2 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveValidationRule(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X size={14} />
                            </Button>
                          </td>
                        )}
                      </tr>
                    ))}

                    {validationRules.length === 0 && (
                      <tr>
                        <td colSpan={canEdit ? 4 : 3} className="px-4 py-4 text-center text-gray-500">
                          No validation rules defined for this page.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default PageEditorPage;
