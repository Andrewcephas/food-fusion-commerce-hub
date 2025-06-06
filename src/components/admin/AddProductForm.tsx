
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ImageUpload from './ImageUpload';

interface AddProductFormProps {
  categories: Array<{ id: string; name: string }>;
  onProductAdded: () => void;
  onCancel: () => void;
}

const AddProductForm = ({ categories, onProductAdded, onCancel }: AddProductFormProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    in_stock: '',
    image_url: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!newProduct.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Product name is required",
        variant: "destructive",
      });
      return;
    }

    if (!newProduct.category_id) {
      toast({
        title: "Validation Error",
        description: "Please select a category",
        variant: "destructive",
      });
      return;
    }

    if (!newProduct.image_url.trim()) {
      toast({
        title: "Validation Error",
        description: "Product image is required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('products')
        .insert({
          name: newProduct.name.trim(),
          description: newProduct.description.trim(),
          price: parseFloat(newProduct.price),
          category_id: newProduct.category_id,
          in_stock: parseInt(newProduct.in_stock),
          image_url: newProduct.image_url.trim(),
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product added successfully!",
      });

      setNewProduct({
        name: '',
        description: '',
        price: '',
        category_id: '',
        in_stock: '',
        image_url: '',
      });
      onProductAdded();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Add New Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              placeholder="Enter product name"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="price">Price (KES) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select 
              value={newProduct.category_id} 
              onValueChange={(value) => setNewProduct({ ...newProduct, category_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="stock">Initial Stock *</Label>
            <Input
              id="stock"
              type="number"
              min="0"
              value={newProduct.in_stock}
              onChange={(e) => setNewProduct({ ...newProduct, in_stock: e.target.value })}
              placeholder="0"
              required
            />
          </div>

          <div className="md:col-span-2">
            <ImageUpload
              label="Product Image"
              value={newProduct.image_url}
              onChange={(value) => setNewProduct({ ...newProduct, image_url: value })}
              required
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              placeholder="Enter product description..."
              rows={3}
            />
          </div>

          <div className="md:col-span-2 flex gap-4">
            <Button type="submit" disabled={loading} className="bg-orange-500 hover:bg-orange-600">
              {loading ? 'Adding Product...' : 'Add Product'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddProductForm;
