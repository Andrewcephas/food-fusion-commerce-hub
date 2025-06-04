
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Minus, Trash2, CreditCard } from 'lucide-react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  customizations: string[];
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar = ({ isOpen, onClose }: CartSidebarProps) => {
  // Sample cart items
  const cartItems: CartItem[] = [
    {
      id: 1,
      name: "Margherita Pizza",
      price: 21.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=100",
      customizations: ["Large (+$3)", "Extra Cheese (+$2)"]
    },
    {
      id: 2,
      name: "Chicken Caesar Salad",
      price: 14.99,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=100",
      customizations: ["Grilled Chicken", "Caesar Dressing"]
    },
    {
      id: 3,
      name: "Classic Burger",
      price: 18.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100",
      customizations: ["Medium", "Cheese (+$1)", "Bacon (+$3)"]
    }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 4.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + deliveryFee + tax;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            Your Cart
            <Badge variant="secondary">{cartItems.length} items</Badge>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white border rounded-lg p-4">
                <div className="flex space-x-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.name}</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      {item.customizations.map((custom, index) => (
                        <div key={index}>{custom}</div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-semibold text-green-600">
                        ${item.price.toFixed(2)}
                      </span>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button variant="outline" size="sm">
                          <Plus className="w-3 h-3" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="border-t pt-4 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-green-600">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Delivery Options */}
            <div className="space-y-2">
              <h4 className="font-semibold">Delivery Options</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="radio" name="delivery" value="delivery" defaultChecked />
                  <span>Delivery (30-45 min)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="delivery" value="pickup" />
                  <span>Pickup (15-20 min)</span>
                </label>
              </div>
            </div>

            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3">
              <CreditCard className="w-4 h-4 mr-2" />
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartSidebar;
