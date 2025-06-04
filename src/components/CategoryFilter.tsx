
import React from 'react';
import { Button } from '@/components/ui/button';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-6">
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          onClick={() => onCategoryChange(category)}
          className={`transition-all duration-200 ${
            selectedCategory === category 
              ? "bg-orange-500 hover:bg-orange-600 text-white" 
              : "hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600"
          }`}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
