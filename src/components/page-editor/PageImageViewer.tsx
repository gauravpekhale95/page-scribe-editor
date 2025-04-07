
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut } from 'lucide-react';

interface PageImageViewerProps {
  imageUrl: string | undefined;
  pageNumber: number;
}

const PageImageViewer: React.FC<PageImageViewerProps> = ({ imageUrl, pageNumber }) => {
  const [zoomLevel, setZoomLevel] = useState(100);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 10, 50));
  };

  return (
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
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={`Page ${pageNumber}`}
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
  );
};

export default PageImageViewer;
