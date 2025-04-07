
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useStore } from '@/store/useStore';
import { Card, CardContent } from '@/components/ui/card';

const StatesListPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, states, setCurrentState } = useStore();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleStateSelect = (state: string) => {
    setCurrentState(state);
    navigate(`/states/${state}`);
  };

  if (!user) {
    return null; // Will redirect
  }

  return (
    <MainLayout title="Select a State">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {states.map((state) => (
          <Card 
            key={state} 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleStateSelect(state)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800">{state}</h3>
                <div className="h-10 w-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                  {state.substring(0, 2)}
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                View all documents for {state}
              </p>
            </CardContent>
          </Card>
        ))}

        {states.length === 0 && (
          <div className="col-span-full flex items-center justify-center p-8 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500 text-center">
              No states available. Please contact an administrator to get access.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default StatesListPage;
