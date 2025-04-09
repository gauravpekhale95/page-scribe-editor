// src/pages/LoginPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import { useStore } from '../store/useStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LocalStorageHelper } from '../utils/localStorageHelper';
import axios from 'axios';

// Define user interface
interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  states?: string[];
}

const VALID_ROLES = ['cca', 'dev'];

const LoginPage = () => {
  const { oktaAuth, authState } = useOktaAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useStore();
  const [isProcessingCallback, setIsProcessingCallback] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roleError, setRoleError] = useState(false);

  // Check if we're on the callback route
  const isCallback = location.pathname === '/login/callback';

  // Function to fetch user from backend API
  const fetchUserFromApi = async (oktaUserId: string, token: string): Promise<UserData | null> => {
    try {
      // const response = await axios.get(`/api/getuser/${oktaUserId}`, {
      //   headers: {
      //     Authorization: `Bearer ${token}`
      //   }
      // });
      
      // if (response.data) {
      //   return response.data;
      // }
      // return {
      //   id:"1234567",
      //   name: "user name",
      //   role: "dev",
      //   states: ["California", "Texas"],
      //   email:"email@user"
      // };
      return null
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  // Function to add new user to the backend
  const addUserToApi = async (userData: Partial<UserData>, token: string): Promise<UserData | null> => {
    try {
      // const response = await axios.post('/api/addUser', {
      //   ...userData,
      //   role: 'unassigned'
      // }, {
      //   headers: {
      //     Authorization: `Bearer ${token}`
      //   }
      // });
      
      // if (response.data) {
      //   return response.data;
      // }
       return {
          id:"1234567",
          name: "user name",
          role: "unassigned",
          states: ["California", "Texas"],
          email:"email@user"
        };;
    } catch (error) {
      console.error('Error adding user:', error);
      return null;
    }
  };

  useEffect(() => {
    // If we're already authenticated, process user data
    if (authState?.isAuthenticated) {

      const processUserData = async (setError: (msg: string) => void, setRoleError: (val: boolean) => void) => {
        const { setUser, setStates } = useStore.getState();
      
        try {
          // Get user info and token from Okta
          const oktaUserInfo = await oktaAuth.getUser();
          const accessToken = await oktaAuth.getAccessToken();
      
          if (accessToken) {
            LocalStorageHelper.setAccessToken(accessToken);
          }
      
          const userId = oktaUserInfo.sub || '';
          let userData = await fetchUserFromApi(userId, accessToken);
      
          // If user not found, create one
          if (!userData && userId) {
            userData = await addUserToApi({
              id: userId,
              name: oktaUserInfo.name || '',
              email: oktaUserInfo.email || ''
            }, accessToken);
          }
      
          if (userData) {
            LocalStorageHelper.setUserRole(userData.role);
      
            if (VALID_ROLES.includes(userData.role.toLowerCase())) {
              const user = {
                id: userId,
                name: oktaUserInfo.name || '',
                email: oktaUserInfo.email || '',
                role: userData.role,
                states: userData.states || []
              };
      
              setUser(user);
              setStates(userData.states || []);
              navigate('/');
            } else {
              setRoleError(true);
            }
          } else {
            setError("Failed to retrieve user data. Please try again later.");
          }
        } catch (error) {
          console.error('Error processing user data:', error);
          setError("An error occurred during login. Please try again.");
        }
      };
      
      
      processUserData();
    }
    
    // Handle the callback logic
    if (isCallback) {
      setIsProcessingCallback(true);
      
      // Process the tokens from the URL
      const handleCallback = async () => {
        try {
          // Parse and store tokens
          await oktaAuth.handleRedirect();
        } catch (error) {
          console.error('Error during Okta callback processing:', error);
          setIsProcessingCallback(false);
          setError("Failed to process authentication. Please try again.");
        }
      };
      
      handleCallback();
    }
  }, [authState, navigate, oktaAuth, setUser, isCallback]);

  const handleLogin = async () => {
    // Reset any previous errors
    setError(null);
    setRoleError(false);
    
    // Save current path as the original URI to return to after login
    const fromUri = location.state?.from?.pathname || '/';
    
    try {
      await oktaAuth.signInWithRedirect({ originalUri: fromUri });
    } catch (error) {
      console.error('Login error:', error);
      setError("Failed to initiate login. Please try again.");
    }
  };

  // Handle logout for users with invalid roles
  const handleLogout = async () => {

    await oktaAuth.signOut();
    setUser(null);
    LocalStorageHelper.clearAccessToken();
    LocalStorageHelper.clearUserRole();
    navigate('/login');
  };

  // Show processing screen during callback
  if (isCallback || isProcessingCallback) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="w-96 text-center">
          <CardHeader>
            <CardTitle>Processing Login</CardTitle>
            <CardDescription>Please wait while we complete authentication...</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error for users with no assigned role
  if (roleError) {
    return (
      <div className="flex h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Access Restricted</CardTitle>
            <CardDescription>Your account requires role assignment</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Not Authorized</AlertTitle>
              <AlertDescription>
                You have successfully authenticated, but you don't have an assigned role yet.
                Please contact the Doc AI administrator to get a proper role assigned to your account.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={handleLogout} variant="outline">
              Sign Out
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Show general errors
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-red-600">Login Error</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={handleLogin}>Try Again</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Standard login screen
  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>Sign in to access Data Prepration Tool</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <img 
            src="./public/docailogo.png" 
            alt="Company Logo" 
            className="mb-4"
          />
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={handleLogin} size="lg">
            Sign in with Okta
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;