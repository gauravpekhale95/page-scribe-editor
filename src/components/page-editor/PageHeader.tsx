
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Save, Check, X, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface PageHeaderProps {
  title: string;
  canEdit: boolean;
  canApprove: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, canEdit, canApprove }) => {
  const navigate = useNavigate();

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

  return (
    <div className="mb-6 flex justify-between items-center">
      <div className="flex items-center">
        <Button variant="outline" size="sm" className="mr-3" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} className="mr-1" /> Back
        </Button>
        <h2 className="text-2xl font-semibold text-gray-800">
          {title}
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
  );
};

export default PageHeader;
