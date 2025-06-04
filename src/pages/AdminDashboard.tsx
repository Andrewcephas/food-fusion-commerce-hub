
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/hooks/useAuth';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Edit, Trash2, Plus, Users, TrendingUp, ShoppingCart, Package } from 'lucide-react';

const AdminDashboard = () => {
  const { isAdmin, profile } = useAuth();
  const { products, refetch } = useProducts();
  const { categories } = useCategories();
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    lowStockItems: 0
  });

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    in_stock: '',
    image_url: '',
  });

  React.useEffect(() => {
    if (isAdmin) {
      fetchStats();
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchStats = async () => {
    try {
      // Get total products
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // Get total users
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get total orders
      const { count: ordersCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      // Get low stock items
      const { count: lowStockCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .lte('in_stock', 5);

      setStats({
        totalProducts: productsCount || 0,
        totalUsers: usersCount || 0,
        totalOrders: ordersCount || 0,
        lowStockItems: lowStockCount || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('products')
        .insert({
          name: newProduct.name,
          description: newProduct.description,
          price: parseFloat(newProduct.price),
          category_id: newProduct.category_id,
          in_stock: parseInt(newProduct.in_stock),
          image_url: newProduct.image_url,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product added successfully!",
      });

      setNewProduct({
        name: '',
        description: '',
        price: '',
        category_id: '',
        in_stock: '',
        image_url: '',
      });
      setShowAddForm(false);
      refetch();
      fetchStats();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product deleted successfully!",
      });

      refetch();
      fetchStats();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateStock = async (productId: string, newStock: number) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ in_stock: newStock })
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Stock updated successfully!",
      });

      refetch();
      fetchStats();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            Welcome, {profile?.full_name || 'Admin'}
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <ShoppingCart className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Low Stock</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.lowStockItems}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <Button 
            variant={activeTab === 'products' ? 'default' : 'outline'}
            onClick={() => setActiveTab('products')}
            className={activeTab === 'products' ? 'bg-orange-500 hover:bg-orange-600' : ''}
          >
            Products Management
          </Button>
          <Button 
            variant={activeTab === 'users' ? 'default' : 'outline'}
            onClick={() => setActiveTab('users')}
            className={activeTab === 'users' ? 'bg-orange-500 hover:bg-orange-600' : ''}
          >
            Users Management
          </Button>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Products Management</h2>
              <Button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Product
              </Button>
            </div>

            {showAddForm && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Add New Product</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="price">Price (KES)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={newProduct.category_id} onValueChange={(value) => setNewProduct({ ...newProduct, category_id: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="stock">Initial Stock</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={newProduct.in_stock}
                        onChange={(e) => setNewProduct({ ...newProduct, in_stock: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="image">Image URL</Label>
                      <Input
                        id="image"
                        type="url"
                        value={newProduct.image_url}
                        onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        required
                      />
                    </div>

                    <div className="md:col-span-2 flex gap-4">
                      <Button type="submit" disabled={loading} className="bg-orange-500 hover:bg-orange-600">
                        {loading ? 'Adding...' : 'Add Product'}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Products Inventory</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="flex items-center space-x-3">
                          <img src={product.image_url} alt={product.name} className="w-10 h-10 rounded object-cover" />
                          <span className="font-medium">{product.name}</span>
                        </TableCell>
                        <TableCell>{product.categories?.name}</TableCell>
                        <TableCell>KES {product.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            defaultValue={product.in_stock}
                            className="w-20"
                            onBlur={(e) => {
                              const newStock = parseInt(e.target.value);
                              if (newStock !== product.in_stock && !isNaN(newStock)) {
                                updateStock(product.id, newStock);
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {product.in_stock <= product.low_stock_threshold ? (
                            <Badge variant="destructive">Low Stock</Badge>
                          ) : (
                            <Badge variant="secondary">In Stock</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-500"
                              onClick={() => deleteProduct(product.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <Card>
            <CardHeader>
              <CardTitle>Users Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user: any) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.full_name || 'N/A'}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.phone || 'N/A'}</TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
