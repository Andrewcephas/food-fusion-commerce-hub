
import React, { useState } from 'react';
import ProductCard from './ProductCard';
import CategoryFilter from './CategoryFilter';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';

const ProductGrid = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  
  const { categories } = useCategories();
  const { products, loading } = useProducts(searchTerm, selectedCategory);

  const categoryNames = ["All", ...categories.map(cat => cat.name)];

  if (loading) {
    return (
      <section id="menu" className="py-8">
        <div className="text-center">Loading delicious Kenyan food...</div>
      </section>
    );
  }

  return (
    <section id="menu" className="py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Kenyan Menu</h2>
        
        {/* Search Bar */}
        <div className="relative max-w-md mx-auto mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search for your favorite Kenyan dish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <CategoryFilter 
          categories={categoryNames}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">No dishes found matching your search.</p>
        </div>
      )}
    </section>
  );
};

export default ProductGrid;
