
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Search,
  Plus,
  Edit,
  Trash2 
} from 'lucide-react';

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  price: number;
  supplier: string;
  lastUpdated: string;
}

const InventoryDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const inventoryItems: InventoryItem[] = [
    {
      id: 1,
      name: "Pizza Dough",
      category: "Ingredients",
      currentStock: 15,
      minStock: 10,
      maxStock: 50,
      price: 2.50,
      supplier: "Fresh Ingredients Co.",
      lastUpdated: "2024-01-15"
    },
    {
      id: 2,
      name: "Mozzarella Cheese",
      category: "Dairy",
      currentStock: 3,
      minStock: 5,
      maxStock: 25,
      price: 8.99,
      supplier: "Dairy Fresh Ltd.",
      lastUpdated: "2024-01-14"
    },
    {
      id: 3,
      name: "Chicken Breast",
      category: "Meat",
      currentStock: 22,
      minStock: 15,
      maxStock: 40,
      price: 12.99,
      supplier: "Premium Meats",
      lastUpdated: "2024-01-15"
    },
    {
      id: 4,
      name: "Lettuce",
      category: "Vegetables",
      currentStock: 8,
      minStock: 10,
      maxStock: 30,
      price: 3.49,
      supplier: "Green Valley Farms",
      lastUpdated: "2024-01-13"
    },
    {
      id: 5,
      name: "Tomatoes",
      category: "Vegetables",
      currentStock: 25,
      minStock: 15,
      maxStock: 35,
      price: 4.99,
      supplier: "Green Valley Farms",
      lastUpdated: "2024-01-15"
    }
  ];

  const lowStockItems = inventoryItems.filter(item => item.currentStock <= item.minStock);
  const totalItems = inventoryItems.length;
  const totalValue = inventoryItems.reduce((sum, item) => sum + (item.currentStock * item.price), 0);

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock <= item.minStock) return 'low';
    if (item.currentStock >= item.maxStock * 0.8) return 'high';
    return 'normal';
  };

  const getStockBadge = (item: InventoryItem) => {
    const status = getStockStatus(item);
    switch (status) {
      case 'low':
        return <Badge variant="destructive">Low Stock</Badge>;
      case 'high':
        return <Badge className="bg-green-500 hover:bg-green-600">In Stock</Badge>;
      default:
        return <Badge variant="secondary">Normal</Badge>;
    }
  };

  const filteredItems = inventoryItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Management</h1>
          <p className="text-gray-600">Track stock levels and manage your inventory</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold">{totalItems}</p>
                </div>
                <Package className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Low Stock Alerts</p>
                  <p className="text-2xl font-bold text-red-500">{lowStockItems.length}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-green-600">${totalValue.toFixed(2)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Categories</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
                <TrendingDown className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Low Stock Alerts */}
        {lowStockItems.length > 0 && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-700">
              <strong>Low Stock Alert:</strong> {lowStockItems.length} items are running low. 
              Consider restocking: {lowStockItems.map(item => item.name).join(', ')}.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="inventory" className="space-y-4">
          <TabsList>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="alerts">Low Stock Alerts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Inventory Items</CardTitle>
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </div>
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search inventory..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-medium">Item</th>
                        <th className="text-left p-4 font-medium">Category</th>
                        <th className="text-left p-4 font-medium">Current Stock</th>
                        <th className="text-left p-4 font-medium">Min/Max</th>
                        <th className="text-left p-4 font-medium">Price</th>
                        <th className="text-left p-4 font-medium">Status</th>
                        <th className="text-left p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredItems.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                          <td className="p-4">
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-gray-500">{item.supplier}</div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline">{item.category}</Badge>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold">{item.currentStock}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-sm text-gray-600">
                              {item.minStock} / {item.maxStock}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="font-medium">${item.price.toFixed(2)}</span>
                          </td>
                          <td className="p-4">
                            {getStockBadge(item)}
                          </td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle>Low Stock Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lowStockItems.map((item) => (
                    <Alert key={item.id} className="border-yellow-200 bg-yellow-50">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <AlertDescription>
                        <div className="flex items-center justify-between">
                          <div>
                            <strong>{item.name}</strong> - Only {item.currentStock} units left 
                            (Min: {item.minStock})
                          </div>
                          <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                            Reorder
                          </Button>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                  {lowStockItems.length === 0 && (
                    <p className="text-gray-500 text-center py-8">No low stock alerts at this time.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Stock Distribution by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['Ingredients', 'Dairy', 'Meat', 'Vegetables'].map((category) => {
                      const categoryItems = inventoryItems.filter(item => item.category === category);
                      const categoryValue = categoryItems.reduce((sum, item) => sum + (item.currentStock * item.price), 0);
                      const percentage = (categoryValue / totalValue) * 100;
                      
                      return (
                        <div key={category}>
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">{category}</span>
                            <span className="text-sm text-gray-600">${categoryValue.toFixed(2)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-orange-500 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 border-l-4 border-green-500 bg-green-50">
                      <div className="flex-1">
                        <p className="font-medium">Stock Updated</p>
                        <p className="text-sm text-gray-600">Tomatoes restocked - 25 units added</p>
                      </div>
                      <span className="text-xs text-gray-500">2h ago</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 border-l-4 border-yellow-500 bg-yellow-50">
                      <div className="flex-1">
                        <p className="font-medium">Low Stock Alert</p>
                        <p className="text-sm text-gray-600">Mozzarella Cheese below minimum threshold</p>
                      </div>
                      <span className="text-xs text-gray-500">4h ago</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 border-l-4 border-blue-500 bg-blue-50">
                      <div className="flex-1">
                        <p className="font-medium">New Item Added</p>
                        <p className="text-sm text-gray-600">Pizza Dough added to inventory</p>
                      </div>
                      <span className="text-xs text-gray-500">1d ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InventoryDashboard;
