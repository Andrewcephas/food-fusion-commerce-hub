
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ProductModal from './ProductModal';

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

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const isLowStock = product.inStock <= product.lowStockThreshold;
  const isOutOfStock = product.inStock === 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  return (
    <>
      <Card 
        className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 left-2 space-y-1">
            <Badge variant="secondary" className="bg-white/90 text-gray-700">
              {product.category}
            </Badge>
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
              ${product.price}
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
            <span>In Stock: {product.inStock}</span>
            <span>{product.customizations.length} options</span>
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
