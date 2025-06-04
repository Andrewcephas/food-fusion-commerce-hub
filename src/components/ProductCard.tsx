
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import ProductModal from './ProductModal';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description: string;
  in_stock: number;
  low_stock_threshold: number;
  customizations: any[];
  categories?: {
    name: string;
  };
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const isLowStock = product.in_stock <= product.low_stock_threshold;
  const isOutOfStock = product.in_stock === 0;

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to add items to cart",
        variant: "destructive",
      });
      return;
    }

    if (isOutOfStock) return;
    
    try {
      await addToCart(product.id, 1);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card 
        className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 left-2 space-y-1">
            {product.categories && (
              <Badge variant="secondary" className="bg-white/90 text-gray-700">
                {product.categories.name}
              </Badge>
            )}
            {isLowStock && !isOutOfStock && (
              <Badge variant="destructive" className="bg-yellow-500 hover:bg-yellow-600">
                Low Stock
              </Badge>
            )}
            {isOutOfStock && (
              <Badge variant="destructive">
                Out of Stock
              </Badge>
            )}
          </div>
          <div className="absolute top-2 right-2">
            <Badge className="bg-green-500 hover:bg-green-600 text-white">
              KES {product.price.toFixed(2)}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-orange-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {product.description}
          </p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>In Stock: {product.in_stock}</span>
            <span>{product.customizations?.length || 0} options</span>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white disabled:bg-gray-300"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {isOutOfStock ? "Out of Stock" : "Quick Add"}
          </Button>
        </CardFooter>
      </Card>

      <ProductModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default ProductCard;
