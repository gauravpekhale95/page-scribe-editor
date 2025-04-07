// src/components/auth/AuthProvider.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { CustomUserClaims, OktaAuth, UserClaims } from '@okta/okta-auth-js';
import { useNavigate, useLocation } from 'react-router-dom';
import { EnvConfig } from '../../envConfig';
import { LocalStorageHelper } from '../../utils/localStorageHelper';

const envConfig = new EnvConfig()

// Create Okta auth instance
const oktaAuth = new OktaAuth({
  issuer: envConfig.OKTA_BASE_URL + envConfig.endpoints.oktaIssuerEndpoint,
  clientId: envConfig.OKTA_APP_ID,
  redirectUri: window.location.origin + '/login/callback',
  scopes: ['openid', 'profile', 'email'],
  pkce: true
});

// Create Auth context
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (originalUri?: string) => void;
  logout: () => void;
  user: UserClaims<CustomUserClaims> | null;
  getAccessToken: () => string | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
  user: {} as UserClaims<CustomUserClaims>,
  getAccessToken: () => null
});

// Add a function to store original URL in sessionStorage
const storeOriginalUrl = (url: string) => {
  sessionStorage.setItem('originalUrl', url);
};

// Add a function to retrieve original URL from sessionStorage
const getOriginalUrl = (): string => {
  return sessionStorage.getItem('originalUrl') || '/';
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<UserClaims<CustomUserClaims>|null>(null);
    const navigate = useNavigate();
    const location = useLocation();
    
    useEffect(() => {
        // Check authentication status on component mount
        const checkAuthentication = async () => {
            setIsLoading(true);
            const authenticated = await oktaAuth.isAuthenticated();
            setIsAuthenticated(authenticated);
            
            if (authenticated) {
                // Get access token and store it
                const tokenObj = await oktaAuth.tokenManager.get('accessToken');
                if (tokenObj) {
                    LocalStorageHelper.setAccessToken(tokenObj.accessToken as string);
                    const userInfo = await oktaAuth.getUser();
                    setUser(userInfo);
                }
                
            } else {
                // Clear token if not authenticated
                LocalStorageHelper.clearAccessToken();
            }
            
            setIsLoading(false);
        };
        
        checkAuthentication();
        
        // Subscribe to authentication state changes
        const handleAuthStateChange = async (authState: { isAuthenticated?: boolean }) => {
            const authenticated = authState.isAuthenticated ?? false;
            setIsAuthenticated(authenticated);
            
            if (authenticated) {
                // Get access token and store it on auth state change
                const tokenObj = await oktaAuth.tokenManager.get('accessToken');
                if (tokenObj) {
                    LocalStorageHelper.setAccessToken(tokenObj.accessToken);
                }
                
                const userInfo = await oktaAuth.getUser();
                setUser(userInfo);
            } else {
                setUser(null);
                // Remove token when not authenticated
                LocalStorageHelper.clearAccessToken ();
            }
        };
        
        oktaAuth.authStateManager.subscribe(handleAuthStateChange);
        
        return () => {
            oktaAuth.authStateManager.unsubscribe(handleAuthStateChange);
        };
    }, []);
    
    // Handle callback from Okta
    useEffect(() => {
        if (location.pathname === '/login/callback') {
            setIsLoading(true);
            
            // Extract the authorization code from URL
            const params = new URLSearchParams(location.search);
            const code = params.get('code');
            
            if (code) {
                // Process the callback to exchange code for tokens
                oktaAuth.token.parseFromUrl()
                .then(res => {
                    // Store tokens in Okta's tokenManager
                    const { tokens } = res;
                    oktaAuth.tokenManager.setTokens(tokens);
                    
                    // Also store access token in localStorage for easy access
                    if (tokens.accessToken) {
                        LocalStorageHelper.setAccessToken(tokens.accessToken.accessToken);
                    }
                    
                    // Get the original URL the user was trying to access
                    const originalUrl = getOriginalUrl();
                    
                    // Clear the stored URL
                    sessionStorage.removeItem('originalUrl');
                    
                    // Set authentication state
                    setIsAuthenticated(true);
                    
                    // Get user info
                    return oktaAuth.getUser()
                    .then(userInfo => {
                        setUser(userInfo);
                        setIsLoading(false);
                        
                        // Navigate to the original URL
                        navigate(originalUrl);
                    });
                })
                .catch(error => {
                    console.error('Error handling redirect callback:', error);
                    setIsLoading(false);
                    navigate('/');
                });
            }
        }
    }, [location, navigate]);
    
    const login = (originalUri?: string) => {
    if (originalUri) {
        // Store the original URI in sessionStorage
        storeOriginalUrl(originalUri);
    } else {
        // Store the current location as the original URI
        storeOriginalUrl(window.location.pathname);
    }
    
    // Redirect to Okta for authentication
    oktaAuth.signInWithRedirect();
};

const getAccessToken = () => {
    return LocalStorageHelper.getAccessToken();
}

const logout = async () => {
    await oktaAuth.signOut();
    setIsAuthenticated(false);
    setUser(null);
    // Remove the access token from localStorage on logout
    LocalStorageHelper.clearAccessToken();
    navigate('/');
};

return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, user, getAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);