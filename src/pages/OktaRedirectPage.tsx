
import React, { useEffect } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { toast } from 'sonner';

const OktaRedirectPage: React.FC = () => {
  const { oktaAuth, authState } = useOktaAuth();
  const navigate = useNavigate();
  const { setUser, loadMockData } = useStore();

  useEffect(() => {
    const handleCallback = async () => {
      if (authState?.isAuthenticated) {
        // Get user info from Okta
        const userInfo = await oktaAuth.getUser();
        console.log('User info:', userInfo);
        
        // Create a user object for our app
        const appUser = {
          email: userInfo.email || '',
          name: `${userInfo.given_name || ''} ${userInfo.family_name || ''}`.trim(),
          role: 'cca', // Default role, admin can change this
          states: [] // Empty states by default
        };
        
        // For demo purposes, also load mock data
        loadMockData();
        
        // Set the user in our app state
        setUser(appUser);
        
        toast.success('Successfully logged in with Okta!');
        navigate('/');
      }
    };
    
    handleCallback();
  }, [authState, oktaAuth, navigate, setUser, loadMockData]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
      <h2 className="text-xl font-medium text-gray-700 ml-3">Processing login...</h2>
    </div>
  );
};

export default OktaRedirectPage;
