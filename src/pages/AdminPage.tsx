import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useStore } from '@/store/useStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Plus, User, Globe, Edit, Trash2, UserPlus, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface UserFormValues {
  name: string;
  email: string;
  role: 'admin' | 'dev' | 'cca' | 'none';
  states: string[];
}

const userFormSchema = z.object({
  name: z.string().min(2, { message: 'Name is required' }),
  email: z.string().email({ message: 'Valid email is required' }),
  role: z.enum(['admin', 'dev', 'cca', 'none']),
  states: z.array(z.string()).optional(),
});

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, states } = useStore();
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([
    { id: '1', name: 'CCA User', email: 'cca@example.com', role: 'cca', states: ['California', 'Texas'] },
    { id: '2', name: 'Dev User', email: 'dev@example.com', role: 'dev', states: ['California', 'New York'] },
    { id: '3', name: 'Admin User', email: 'admin@example.com', role: 'admin', states: [] },
    { id: '4', name: 'New User', email: 'new@example.com', role: 'none', states: [] },
  ]);

  const userForm = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'cca',
      states: [],
    },
  });

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

  const handleAddUser = () => {
    userForm.reset({
      name: '',
      email: '',
      role: 'cca',
      states: [],
    });
    setIsAddUserDialogOpen(true);
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    userForm.reset({
      name: user.name,
      email: user.email,
      role: user.role,
      states: user.states,
    });
    setIsEditUserDialogOpen(true);
  };

  const handleDeleteUser = (user: any) => {
    setSelectedUser(user);
    setIsDeleteUserDialogOpen(true);
  };

  const onAddUserSubmit = (data: UserFormValues) => {
    const newUser = {
      id: `${users.length + 1}`,
      ...data,
    };
    setUsers([...users, newUser]);
    setIsAddUserDialogOpen(false);
    toast.success('User added successfully');
  };

  const onEditUserSubmit = (data: UserFormValues) => {
    const updatedUsers = users.map(u => 
      u.id === selectedUser.id 
        ? { ...u, ...data } 
        : u
    );
    setUsers(updatedUsers);
    setIsEditUserDialogOpen(false);
    toast.success('User updated successfully');
  };

  const onDeleteUser = () => {
    const updatedUsers = users.filter(u => u.id !== selectedUser.id);
    setUsers(updatedUsers);
    setIsDeleteUserDialogOpen(false);
    toast.success('User deleted successfully');
  };

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
            <Button onClick={handleAddUser}>
              <UserPlus size={16} className="mr-2" /> Add User
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
                      <th className="px-6 py-3 text-left text-gray-500 font-medium tracking-wider">States</th>
                      <th className="px-6 py-3 text-right text-gray-500 font-medium tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((mockUser) => (
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
                          {mockUser.role !== 'none' ? (
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              mockUser.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                              mockUser.role === 'dev' ? 'bg-blue-100 text-blue-800' : 
                              'bg-green-100 text-green-800'
                            }`}>
                              {mockUser.role.toUpperCase()}
                            </span>
                          ) : (
                            <span className="flex items-center text-xs text-amber-600 font-medium">
                              <AlertTriangle size={14} className="mr-1" /> 
                              No role assigned
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {mockUser.states?.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {mockUser.states.slice(0, 2).map((state: string) => (
                                <span key={state} className="px-2 py-1 text-xs bg-gray-100 rounded-full">
                                  {state}
                                </span>
                              ))}
                              {mockUser.states.length > 2 && (
                                <span className="px-2 py-1 text-xs bg-gray-100 rounded-full">
                                  +{mockUser.states.length - 2} more
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">None assigned</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditUser(mockUser)}>
                            <Edit size={14} className="mr-1" /> Edit
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDeleteUser(mockUser)}>
                            <Trash2 size={14} className="mr-1" /> Delete
                          </Button>
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

      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <Form {...userForm}>
            <form onSubmit={userForm.handleSubmit(onAddUserSubmit)} className="space-y-4">
              <FormField
                control={userForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={userForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="user@example.com" type="email" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={userForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="admin" id="admin" />
                          <Label htmlFor="admin">Admin</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="dev" id="dev" />
                          <Label htmlFor="dev">Developer</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="cca" id="cca" />
                          <Label htmlFor="cca">CCA</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={userForm.control}
                name="states"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned States</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          if (!field.value.includes(value)) {
                            field.onChange([...field.value, value]);
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select states" />
                        </SelectTrigger>
                        <SelectContent>
                          {['California', 'Texas', 'New York', 'Florida', 'Illinois'].map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    {field.value.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {field.value.map((state) => (
                          <div key={state} className="bg-gray-100 px-2 py-1 rounded-md text-xs flex items-center">
                            {state}
                            <button
                              type="button"
                              className="ml-1 text-gray-500 hover:text-gray-700"
                              onClick={() => {
                                field.onChange(field.value.filter(s => s !== state));
                              }}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add User</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <Form {...userForm}>
            <form onSubmit={userForm.handleSubmit(onEditUserSubmit)} className="space-y-4">
              <FormField
                control={userForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={userForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="user@example.com" type="email" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={userForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="admin" id="edit-admin" />
                          <Label htmlFor="edit-admin">Admin</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="dev" id="edit-dev" />
                          <Label htmlFor="edit-dev">Developer</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="cca" id="edit-cca" />
                          <Label htmlFor="edit-cca">CCA</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="none" id="edit-none" />
                          <Label htmlFor="edit-none">No role (Unassigned)</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={userForm.control}
                name="states"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned States</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          if (!field.value.includes(value)) {
                            field.onChange([...field.value, value]);
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select states" />
                        </SelectTrigger>
                        <SelectContent>
                          {['California', 'Texas', 'New York', 'Florida', 'Illinois'].map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    {field.value.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {field.value.map((state) => (
                          <div key={state} className="bg-gray-100 px-2 py-1 rounded-md text-xs flex items-center">
                            {state}
                            <button
                              type="button"
                              className="ml-1 text-gray-500 hover:text-gray-700"
                              onClick={() => {
                                field.onChange(field.value.filter(s => s !== state));
                              }}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditUserDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteUserDialogOpen} onOpenChange={setIsDeleteUserDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center mb-4">Are you sure you want to delete this user?</p>
            <p className="text-center font-medium">{selectedUser?.name}</p>
            <p className="text-center text-gray-500 text-sm mb-4">{selectedUser?.email}</p>
            <div className="flex justify-center">
              <div className="bg-red-50 text-red-700 p-3 rounded-md flex items-start">
                <AlertTriangle className="mt-0.5 mr-2" size={16} />
                <div>
                  <p className="font-medium">Warning</p>
                  <p className="text-sm">This action cannot be undone. The user will immediately lose all access to the system.</p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteUserDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={onDeleteUser}>Delete User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default AdminPage;
