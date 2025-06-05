
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

export const useProducts = (searchTerm?: string, categoryFilter?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, categoryFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('products')
        .select(`
          *,
          categories (
            name
          )
        `)
        .eq('is_available', true);

      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      if (categoryFilter && categoryFilter !== 'All') {
        query = query.eq('categories.name', categoryFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      const transformedProducts: Product[] = (data || []).map(item => ({
        ...item,
        customizations: Array.isArray(item.customizations) ? item.customizations : []
      }));
      
      setProducts(transformedProducts);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, refetch: fetchProducts };
};
