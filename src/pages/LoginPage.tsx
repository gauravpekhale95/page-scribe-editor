
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { toast } from 'sonner';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, loadMockData } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In a real app, this would be an API call to authenticate
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo purposes, we'll just set mock user data
      loadMockData();
      
      // Navigate to the states page
      toast.success('Successfully logged in!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to login. Please check your credentials.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (role: 'cca' | 'dev' | 'admin') => {
    setIsLoading(true);

    // Load mock data
    loadMockData();

    // Override with specific role
    setTimeout(() => {
      const user = {
        email: `${role}@example.com`,
        name: `${role.toUpperCase()} User`,
        role,
        states: ['California', 'Texas', 'New York', 'Florida', 'Illinois']
      };
      
      setUser(user);
      toast.success(`Logged in as ${role.toUpperCase()}!`);
      navigate('/');
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Document JSON & Validation Tool</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Button variant="link" className="text-xs p-0 h-auto" type="button">
                  Forgot password?
                </Button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Quick Demo Access</span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-3 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDemoLogin('cca')}
                disabled={isLoading}
              >
                CCA Role
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDemoLogin('dev')}
                disabled={isLoading}
              >
                Dev Role
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDemoLogin('admin')}
                disabled={isLoading}
              >
                Admin Role
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-center text-sm text-gray-500 mt-2">
            For demonstration purposes only. This is a mock login page.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
