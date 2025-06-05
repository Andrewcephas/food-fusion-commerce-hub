
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { CreditCard, Receipt, Search, Plus, Minus, Trash2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProducts } from '@/hooks/useProducts';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';

interface POSItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  image_url: string;
}

const POSSystem = () => {
  const [currentOrder, setCurrentOrder] = useState<POSItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { products } = useProducts(searchTerm);
  const { user, isAdmin } = useAuth();

  const addToOrder = (product: any) => {
    const existingItem = currentOrder.find(orderItem => orderItem.id === product.id);
    
    if (existingItem) {
      setCurrentOrder(prev =>
        prev.map(orderItem =>
          orderItem.id === product.id
            ? { ...orderItem, quantity: orderItem.quantity + 1 }
            : orderItem
        )
      );
    } else {
      setCurrentOrder(prev => [...prev, { 
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        category: product.categories?.name || 'Other',
        image_url: product.image_url
      }]);
    }

    toast({
      title: "Added to order",
      description: `${product.name} added to current order`,
    });
  };

  const updateQuantity = (id: string, change: number) => {
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

  const removeFromOrder = (id: string) => {
    setCurrentOrder(prev => prev.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return currentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const processPayment = async () => {
    if (currentOrder.length === 0) {
      toast({
        title: "No items in order",
        description: "Please add items to the order before processing payment",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id,
          total_amount: calculateTotal(),
          status: 'confirmed',
          delivery_address: 'In-store pickup',
          phone: 'POS System'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Add order items
      const orderItems = currentOrder.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Update product stock
      for (const item of currentOrder) {
        const product = products.find(p => p.id === item.id);
        if (product) {
          await supabase
            .from('products')
            .update({ in_stock: product.in_stock - item.quantity })
            .eq('id', item.id);
        }
      }

      toast({
        title: "Payment processed",
        description: `Order #${order.id.slice(-8)} - Total: KES ${calculateTotal().toFixed(2)}`,
      });

      generateReceipt(order.id);
      setCurrentOrder([]);
      
    } catch (error: any) {
      toast({
        title: "Error processing payment",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateReceipt = (orderId: string) => {
    const receiptData = {
      orderNumber: orderId.slice(-8),
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

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access the POS system.</p>
          <Button 
            onClick={() => window.location.href = '/'}
            className="mt-4 bg-orange-500 hover:bg-orange-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Menu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
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
                  {products.map((product) => (
                    <Card
                      key={product.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => addToOrder(product)}
                    >
                      <CardContent className="p-4">
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          className="w-full h-32 object-cover rounded mb-2"
                        />
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-sm">{product.name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {product.categories?.name}
                          </Badge>
                        </div>
                        <div className="text-lg font-bold text-green-600 mb-2">
                          KES {product.price.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Stock: {product.in_stock}
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
                          <p className="text-sm text-gray-600">KES {item.price.toFixed(2)} each</p>
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
                        <span className="text-green-600">KES {calculateTotal().toFixed(2)}</span>
                      </div>
                      <Button
                        onClick={processPayment}
                        disabled={loading}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                        size="lg"
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        {loading ? "Processing..." : "Process Payment"}
                      </Button>
                      <Button
                        onClick={() => generateReceipt("temp")}
                        variant="outline"
                        className="w-full"
                        size="lg"
                      >
                        <Receipt className="w-4 h-4 mr-2" />
                        Print Receipt
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
