
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  inStock: number;
  lowStockThreshold: number;
  customizations: Array<{
    name: string;
    options: string[];
  }>;
}

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const isLowStock = product.inStock <= product.lowStockThreshold;
  const isOutOfStock = product.inStock === 0;

  const calculatePrice = () => {
    let totalPrice = product.price;
    Object.values(selectedOptions).forEach(option => {
      const priceMatch = option.match(/\(\+\$(\d+(?:\.\d{2})?)\)/);
      if (priceMatch) {
        totalPrice += parseFloat(priceMatch[1]);
      }
    });
    return totalPrice * quantity;
  };

  const handleOptionSelect = (customizationName: string, option: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [customizationName]: option
    }));
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    const orderDetails = {
      product: product.name,
      quantity,
      options: selectedOptions,
      totalPrice: calculatePrice()
    };

    console.log('Adding to cart:', orderDetails);
    
    toast({
      title: "Added to cart",
      description: `${quantity}x ${product.name} added to your cart`,
    });
    
    onClose();
  };

  const increaseQuantity = () => {
    if (quantity < product.inStock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Image */}
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="absolute top-2 left-2 space-y-1">
              <Badge variant="secondary">{product.category}</Badge>
              {isLowStock && !isOutOfStock && (
                <Badge variant="destructive" className="bg-yellow-500 hover:bg-yellow-600">
                  Low Stock ({product.inStock} left)
                </Badge>
              )}
              {isOutOfStock && (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-green-600">${product.price}</span>
              <span className="text-sm text-gray-500">In Stock: {product.inStock}</span>
            </div>
          </div>

          {/* Customizations */}
          {product.customizations.map((customization, index) => (
            <div key={index}>
              <h4 className="font-semibold mb-3">{customization.name}</h4>
              <div className="grid grid-cols-1 gap-2">
                {customization.options.map((option, optionIndex) => (
                  <label
                    key={optionIndex}
                    className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="radio"
                      name={customization.name}
                      value={option}
                      checked={selectedOptions[customization.name] === option}
                      onChange={() => handleOptionSelect(customization.name, option)}
                      className="text-orange-500 focus:ring-orange-500"
                    />
                    <span className="flex-1">{option}</span>
                  </label>
                ))}
              </div>
              {index < product.customizations.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}

          {/* Quantity and Add to Cart */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Quantity:</span>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-8 text-center font-semibold">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={increaseQuantity}
                  disabled={quantity >= product.inStock}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xl font-bold">
              <span>Total:</span>
              <span className="text-green-600">${calculatePrice().toFixed(2)}</span>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white disabled:bg-gray-300 py-3 text-lg"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {isOutOfStock ? "Out of Stock" : `Add to Cart - $${calculatePrice().toFixed(2)}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
