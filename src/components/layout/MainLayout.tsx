
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBreadcrumbs?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  title = 'Document Validation Tool',
  showBreadcrumbs = true
}) => {
  const navigate = useNavigate();
  const { user, currentState, currentDocument, currentVersion, setUser } = useStore();
  
  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  const breadcrumbs = [
    { label: 'States', path: '/', active: !currentState },
    currentState && { 
      label: currentState, 
      path: `/states/${currentState}`, 
      active: !!currentState && !currentDocument 
    },
    currentDocument && { 
      label: 'Document', 
      path: `/documents/${currentDocument}`, 
      active: !!currentDocument && !currentVersion 
    },
    currentVersion && { 
      label: 'Version', 
      path: `/versions/${currentVersion}`, 
      active: !!currentVersion 
    },
  ].filter(Boolean);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
            
            {/* Breadcrumbs */}
            {showBreadcrumbs && breadcrumbs.length > 0 && (
              <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && <span>/</span>}
                    <button 
                      onClick={() => navigate(crumb.path)}
                      className={`hover:text-primary transition-colors ${crumb.active ? 'font-medium text-primary' : ''}`}
                    >
                      {crumb.label}
                    </button>
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
          
          {/* User Menu */}
          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                  <User size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.role.toUpperCase()}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut size={18} />
              </Button>
            </div>
          )}
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Document JSON & Validation Tool
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
