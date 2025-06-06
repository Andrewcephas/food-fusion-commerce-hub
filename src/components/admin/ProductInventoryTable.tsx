
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  name: string;
  price: number;
  in_stock: number;
  low_stock_threshold: number;
  image_url: string;
  is_available: boolean;
  categories?: { name: string };
}

interface ProductInventoryTableProps {
  products: Product[];
  onProductsChange: () => void;
}

const ProductInventoryTable = ({ products, onProductsChange }: ProductInventoryTableProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.categories?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

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

      onProductsChange();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateStock = async (productId: string, newStock: number) => {
    if (newStock < 0) {
      toast({
        title: "Invalid Stock",
        description: "Stock cannot be negative",
        variant: "destructive",
      });
      return;
    }

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

      onProductsChange();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleAvailability = async (productId: string, currentAvailability: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_available: !currentAvailability })
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Product ${!currentAvailability ? 'enabled' : 'disabled'} successfully!`,
      });

      onProductsChange();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Products Inventory ({filteredProducts.length} items)</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
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
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    {searchTerm ? 'No products found matching your search.' : 'No products available.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id} className={!product.is_available ? 'opacity-60' : ''}>
                    <TableCell className="flex items-center space-x-3">
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="w-12 h-12 rounded-lg object-cover border border-gray-200" 
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400';
                        }}
                      />
                      <div>
                        <span className="font-medium">{product.name}</span>
                        {!product.is_available && (
                          <div className="text-xs text-red-500">Disabled</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.categories?.name || 'No Category'}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">KES {product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        defaultValue={product.in_stock}
                        className="w-20"
                        onBlur={(e) => {
                          const newStock = parseInt(e.target.value);
                          if (newStock !== product.in_stock && !isNaN(newStock)) {
                            updateStock(product.id, newStock);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const newStock = parseInt((e.target as HTMLInputElement).value);
                            if (newStock !== product.in_stock && !isNaN(newStock)) {
                              updateStock(product.id, newStock);
                            }
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-1">
                        {product.in_stock <= product.low_stock_threshold && product.is_available ? (
                          <Badge variant="destructive">Low Stock</Badge>
                        ) : product.is_available ? (
                          <Badge variant="secondary">In Stock</Badge>
                        ) : (
                          <Badge variant="outline">Disabled</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toggleAvailability(product.id, product.is_available)}
                          className={product.is_available ? 'text-yellow-600' : 'text-green-600'}
                        >
                          {product.is_available ? 'Disable' : 'Enable'}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => deleteProduct(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductInventoryTable;
