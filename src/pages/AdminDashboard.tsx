
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import StatsCards from '@/components/admin/StatsCards';
import AddProductForm from '@/components/admin/AddProductForm';
import ProductInventoryTable from '@/components/admin/ProductInventoryTable';
import UserManagementTable from '@/components/admin/UserManagementTable';
import { seedKenyanFood } from '@/utils/seedData';
import { Plus, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, isAdmin, profile, loading: authLoading } = useAuth();
  const { products, refetch } = useProducts();
  const { categories, refetch: refetchCategories } = useCategories();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  const [seedingData, setSeedingData] = useState(false);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    lowStockItems: 0
  });

  React.useEffect(() => {
    console.log('AdminDashboard - user:', user);
    console.log('AdminDashboard - isAdmin:', isAdmin);
    console.log('AdminDashboard - authLoading:', authLoading);
    
    if (!authLoading && !user) {
      console.log('Redirecting to admin login - no user');
      navigate('/admin/login');
      return;
    }
    
    if (!authLoading && user && !isAdmin) {
      console.log('Redirecting to admin login - not admin');
      navigate('/admin/login');
      return;
    }
    
    if (user && isAdmin) {
      fetchStats();
      fetchUsers();
    }
  }, [user, isAdmin, authLoading, navigate]);

  const fetchStats = async () => {
    try {
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { count: ordersCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

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

  const handleProductAdded = () => {
    setShowAddForm(false);
    refetch();
    fetchStats();
  };

  const handleSeedData = async () => {
    setSeedingData(true);
    try {
      const result = await seedKenyanFood();
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        refetch();
        refetchCategories();
        fetchStats();
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSeedingData(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You need admin privileges to access this page.</p>
          <Button onClick={() => navigate('/admin/login')} className="bg-orange-500 hover:bg-orange-600">
            Go to Admin Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <Button 
              onClick={handleSeedData}
              disabled={seedingData}
              variant="outline"
              className="bg-blue-50 hover:bg-blue-100"
            >
              <Database className="w-4 h-4 mr-2" />
              {seedingData ? 'Adding Sample Data...' : 'Add Sample Food Data'}
            </Button>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              Welcome, {profile?.full_name || 'Admin'}
            </Badge>
          </div>
        </div>

        <StatsCards stats={stats} />

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
              <AddProductForm
                categories={categories}
                onProductAdded={handleProductAdded}
                onCancel={() => setShowAddForm(false)}
              />
            )}

            <ProductInventoryTable
              products={products}
              onProductsChange={() => {
                refetch();
                fetchStats();
              }}
            />
          </div>
        )}

        {activeTab === 'users' && (
          <UserManagementTable users={users} />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
