
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useStore } from '@/store/useStore';
import { ValidationRule } from '@/store/useStore';

// Import refactored components
import PageHeader from '@/components/page-editor/PageHeader';
import PageImageViewer from '@/components/page-editor/PageImageViewer';
import JsonEditor from '@/components/page-editor/JsonEditor';
import ValidationRulesEditor from '@/components/page-editor/ValidationRulesEditor';

const PageEditorPage: React.FC = () => {
  const navigate = useNavigate();
  const { pageId } = useParams<{ pageId: string }>();
  const { 
    user, 
    pages, 
    setCurrentPage 
  } = useStore();

  const [jsonContent, setJsonContent] = useState('');
  const [validationRules, setValidationRules] = useState<ValidationRule[]>([]);

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

  if (!user || !currentPage) {
    return null; // Will redirect or handle loading state
  }

  const canEdit = user.role === 'cca';
  const canApprove = user.role === 'dev';
  const pageTitle = `Page ${currentPage.pageNumber} Editor`;

  return (
    <MainLayout title={`Page ${currentPage.pageNumber} Editor`}>
      <PageHeader 
        title={pageTitle} 
        canEdit={canEdit} 
        canApprove={canApprove} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left side: Page Image Viewer */}
        <PageImageViewer 
          imageUrl={currentPage.imageUrl} 
          pageNumber={currentPage.pageNumber} 
        />

        {/* Right side: JSON Editor and VRs */}
        <div className="flex flex-col gap-6">
          {/* JSON Editor */}
          <JsonEditor 
            jsonContent={jsonContent} 
            onJsonChange={handleJsonChange} 
            canEdit={canEdit} 
          />

          {/* Validation Rules */}
          <ValidationRulesEditor 
            validationRules={validationRules}
            onValidationRuleChange={handleValidationRuleChange}
            onAddValidationRule={handleAddValidationRule}
            onRemoveValidationRule={handleRemoveValidationRule}
            canEdit={canEdit}
            pageId={currentPage.id}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default PageEditorPage;
