
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { CreditCard, Receipt, Search, Plus, Minus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface POSItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

const POSSystem = () => {
  const [currentOrder, setCurrentOrder] = useState<POSItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const menuItems = [
    { id: 1, name: "Margherita Pizza", price: 18.99, category: "Pizza" },
    { id: 2, name: "Chicken Caesar Salad", price: 14.99, category: "Salads" },
    { id: 3, name: "Classic Burger", price: 16.99, category: "Burgers" },
    { id: 4, name: "Pad Thai", price: 15.99, category: "Asian" },
    { id: 5, name: "Chocolate Lava Cake", price: 8.99, category: "Desserts" },
    { id: 6, name: "Fresh Smoothie Bowl", price: 12.99, category: "Healthy" },
  ];

  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToOrder = (item: any) => {
    const existingItem = currentOrder.find(orderItem => orderItem.id === item.id);
    
    if (existingItem) {
      setCurrentOrder(prev =>
        prev.map(orderItem =>
          orderItem.id === item.id
            ? { ...orderItem, quantity: orderItem.quantity + 1 }
            : orderItem
        )
      );
    } else {
      setCurrentOrder(prev => [...prev, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: number, change: number) => {
    setCurrentOrder(prev =>
      prev.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      }).filter(item => item.quantity > 0)
    );
  };

  const removeFromOrder = (id: number) => {
    setCurrentOrder(prev => prev.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return currentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const processPayment = () => {
    if (currentOrder.length === 0) {
      toast({
        title: "No items in order",
        description: "Please add items to the order before processing payment",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Payment processed",
      description: `Order total: $${calculateTotal().toFixed(2)}`,
    });

    // Generate receipt
    generateReceipt();
    
    // Clear order
    setCurrentOrder([]);
  };

  const generateReceipt = () => {
    const receiptData = {
      orderNumber: Math.floor(Math.random() * 10000),
      items: currentOrder,
      total: calculateTotal(),
      timestamp: new Date().toLocaleString()
    };

    console.log('Receipt generated:', receiptData);
    
    toast({
      title: "Receipt generated",
      description: `Order #${receiptData.orderNumber}`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Point of Sale System</h1>
          <p className="text-gray-600">Process orders and manage transactions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menu Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Menu Items</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search menu items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredItems.map((item) => (
                    <Card
                      key={item.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => addToOrder(item)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-sm">{item.name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {item.category}
                          </Badge>
                        </div>
                        <div className="text-lg font-bold text-green-600">
                          ${item.price.toFixed(2)}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current Order */}
          <div>
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Current Order
                  <Badge variant="secondary">{currentOrder.length} items</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {currentOrder.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No items in order</p>
                  ) : (
                    currentOrder.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFromOrder(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {currentOrder.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div className="space-y-2">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-green-600">${calculateTotal().toFixed(2)}</span>
                      </div>
                      <Button
                        onClick={processPayment}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                        size="lg"
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Process Payment
                      </Button>
                      <Button
                        onClick={generateReceipt}
                        variant="outline"
                        className="w-full"
                        size="lg"
                      >
                        <Receipt className="w-4 h-4 mr-2" />
                        Generate Receipt
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSSystem;
