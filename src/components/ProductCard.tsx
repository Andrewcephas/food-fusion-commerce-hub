import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { Plus, Minus } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: string;
  in_stock: number;
  low_stock_threshold: number;
  is_available: boolean;
  customizations: any[];
  categories?: {
    name: string;
  };
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string, quantity: number) => void;
  showQuantityControls?: boolean;
  showAddButton?: boolean;
}

const ProductCard = ({ 
  product, 
  onAddToCart, 
  showQuantityControls = false,
  showAddButton = true 
}: ProductCardProps) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = React.useState(1);

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product.id, quantity);
    } else {
      addToCart(product, quantity);
    }
    
    toast({
      title: "Added to cart",
      description: `${quantity}x ${product.name} added to cart`,
    });
  };

  const incrementQuantity = () => {
    if (quantity < product.in_stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {product.in_stock <= product.low_stock_threshold && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            Low Stock
          </Badge>
        )}
        {!product.is_available && (
          <Badge variant="secondary" className="absolute top-2 left-2">
            Unavailable
          </Badge>
        )}
      </div>
      
      <CardContent className="flex-1 flex flex-col justify-between p-4">
        <div>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xl font-bold text-orange-600">
              KES {product.price.toFixed(2)}
            </span>
            <span className="text-sm text-gray-500">
              Stock: {product.in_stock}
            </span>
          </div>
        </div>

        {showQuantityControls && (
          <div className="flex items-center justify-center gap-3 mb-3">
            <Button
              variant="outline"
              size="icon"
              onClick={decrementQuantity}
              disabled={quantity <= 1}
              className="h-8 w-8"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={incrementQuantity}
              disabled={quantity >= product.in_stock}
              className="h-8 w-8"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}

        {showAddButton && (
          <Button
            onClick={handleAddToCart}
            disabled={!product.is_available || product.in_stock === 0}
            className="w-full bg-orange-500 hover:bg-orange-600"
          >
            {!product.is_available ? 'Unavailable' : 
             product.in_stock === 0 ? 'Out of Stock' : 
             'Add to Cart'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;
