
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useStore } from '@/store/useStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, User, Globe } from 'lucide-react';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useStore();

  // Redirect to login if user is not authenticated or not an admin
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') {
    return null; // Will redirect
  }

  return (
    <MainLayout title="Admin Control Panel">
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="states">State Access</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              User Management
            </h2>
            <Button>
              <Plus size={16} className="mr-2" /> Add User
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 text-xs uppercase">
                    <tr>
                      <th className="px-6 py-3 text-left text-gray-500 font-medium tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-gray-500 font-medium tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-gray-500 font-medium tracking-wider">Role</th>
                      <th className="px-6 py-3 text-right text-gray-500 font-medium tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { id: '1', name: 'CCA User', email: 'cca@example.com', role: 'cca' },
                      { id: '2', name: 'Dev User', email: 'dev@example.com', role: 'dev' },
                      { id: '3', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
                    ].map((mockUser) => (
                      <tr key={mockUser.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                              <User size={14} className="text-gray-600" />
                            </div>
                            <span className="font-medium text-gray-900">{mockUser.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {mockUser.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            {mockUser.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="states" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              State Access Management
            </h2>
            <Button>
              <Plus size={16} className="mr-2" /> Add State
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['California', 'Texas', 'New York', 'Florida', 'Illinois'].map((state) => (
                  <Card key={state} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3 pt-4">
                      <CardTitle className="text-lg flex items-center">
                        <Globe size={18} className="mr-2 text-blue-500" />
                        {state}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-500 mb-3">
                        Users with access: 3
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Manage Access
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default AdminPage;
