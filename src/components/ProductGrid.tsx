
import React, { useState } from 'react';
import ProductCard from './ProductCard';
import CategoryFilter from './CategoryFilter';

const sampleProducts = [
  {
    id: 1,
    name: "Margherita Pizza",
    price: 18.99,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400",
    category: "Pizza",
    description: "Fresh mozzarella, tomato sauce, and basil on our signature dough",
    inStock: 25,
    lowStockThreshold: 5,
    customizations: [
      { name: "Size", options: ["Small (+$0)", "Medium (+$3)", "Large (+$6)"] },
      { name: "Extra Toppings", options: ["Pepperoni (+$2)", "Mushrooms (+$1)", "Extra Cheese (+$2)"] }
    ]
  },
  {
    id: 2,
    name: "Chicken Caesar Salad",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400",
    category: "Salads",
    description: "Grilled chicken, romaine lettuce, parmesan, and our house Caesar dressing",
    inStock: 15,
    lowStockThreshold: 5,
    customizations: [
      { name: "Protein", options: ["Grilled Chicken", "Crispy Chicken (+$2)", "No Protein (-$3)"] },
      { name: "Dressing", options: ["Caesar", "Ranch", "Italian"] }
    ]
  },
  {
    id: 3,
    name: "Classic Burger",
    price: 16.99,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
    category: "Burgers",
    description: "Beef patty, lettuce, tomato, onion, and our special sauce",
    inStock: 2,
    lowStockThreshold: 5,
    customizations: [
      { name: "Cooking", options: ["Medium Rare", "Medium", "Well Done"] },
      { name: "Add-ons", options: ["Cheese (+$1)", "Bacon (+$3)", "Avocado (+$2)"] }
    ]
  },
  {
    id: 4,
    name: "Pad Thai",
    price: 15.99,
    image: "https://images.unsplash.com/photo-1559314809-0f31657dcc5e?w=400",
    category: "Asian",
    description: "Traditional Thai stir-fried noodles with shrimp, tofu, and peanuts",
    inStock: 18,
    lowStockThreshold: 5,
    customizations: [
      { name: "Spice Level", options: ["Mild", "Medium", "Hot", "Extra Hot"] },
      { name: "Protein", options: ["Shrimp", "Chicken (+$2)", "Tofu", "Mixed (+$3)"] }
    ]
  },
  {
    id: 5,
    name: "Chocolate Lava Cake",
    price: 8.99,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400",
    category: "Desserts",
    description: "Warm chocolate cake with molten center, served with vanilla ice cream",
    inStock: 12,
    lowStockThreshold: 5,
    customizations: [
      { name: "Ice Cream", options: ["Vanilla", "Chocolate", "Strawberry", "No Ice Cream"] }
    ]
  },
  {
    id: 6,
    name: "Fresh Smoothie Bowl",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400",
    category: "Healthy",
    description: "Acai base topped with fresh fruits, granola, and honey",
    inStock: 8,
    lowStockThreshold: 5,
    customizations: [
      { name: "Base", options: ["Acai", "Mango", "Dragon Fruit (+$2)"] },
      { name: "Toppings", options: ["Granola", "Coconut Flakes", "Chia Seeds", "All (+$3)"] }
    ]
  }
];

const categories = ["All", "Pizza", "Burgers", "Salads", "Asian", "Desserts", "Healthy"];

const ProductGrid = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products] = useState(sampleProducts);

  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <section id="menu">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Our Menu</h2>
        <CategoryFilter 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
