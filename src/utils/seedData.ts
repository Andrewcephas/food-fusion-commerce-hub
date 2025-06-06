
import { supabase } from '@/integrations/supabase/client';

export const seedKenyanFood = async () => {
  try {
    // Check if we already have categories
    const { data: existingCategories } = await supabase
      .from('categories')
      .select('name');

    const existingCategoryNames = existingCategories?.map(cat => cat.name) || [];

    // Categories to add (only if they don't exist)
    const categoriesToAdd = [
      { name: 'Main Dishes', description: 'Traditional Kenyan main courses', image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400' },
      { name: 'Beverages', description: 'Traditional and modern drinks', image_url: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400' },
      { name: 'Sides', description: 'Accompaniments and side dishes', image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400' },
      { name: 'Snacks', description: 'Light bites and traditional snacks', image_url: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400' }
    ].filter(cat => !existingCategoryNames.includes(cat.name));

    // Add missing categories
    if (categoriesToAdd.length > 0) {
      await supabase.from('categories').insert(categoriesToAdd);
    }

    // Get all categories for product insertion
    const { data: categories } = await supabase
      .from('categories')
      .select('id, name');

    const categoryMap = categories?.reduce((acc, cat) => {
      acc[cat.name] = cat.id;
      return acc;
    }, {} as Record<string, string>) || {};

    // Check if we already have products
    const { count: productCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    // Only add products if we don't have many
    if ((productCount || 0) < 5) {
      const productsToAdd = [
        // Main Dishes
        { name: 'Nyama Choma', description: 'Grilled beef marinated in traditional spices, served with ugali', price: 850.00, category_id: categoryMap['Main Dishes'], in_stock: 25, image_url: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400' },
        { name: 'Ugali with Sukuma Wiki', description: 'Traditional cornmeal staple with collard greens', price: 350.00, category_id: categoryMap['Main Dishes'], in_stock: 30, image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400' },
        { name: 'Githeri', description: 'Mixed beans and maize with vegetables', price: 280.00, category_id: categoryMap['Main Dishes'], in_stock: 20, image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400' },
        { name: 'Tilapia Fish', description: 'Fresh tilapia fish grilled with spices', price: 650.00, category_id: categoryMap['Main Dishes'], in_stock: 15, image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400' },
        
        // Beverages
        { name: 'Chai Ya Tangawizi', description: 'Traditional ginger tea', price: 150.00, category_id: categoryMap['Beverages'], in_stock: 50, image_url: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400' },
        { name: 'Fresh Mango Juice', description: 'Freshly squeezed mango juice', price: 180.00, category_id: categoryMap['Beverages'], in_stock: 25, image_url: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400' },
        
        // Sides
        { name: 'Chapati', description: 'Soft flatbread', price: 80.00, category_id: categoryMap['Sides'], in_stock: 35, image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400' },
        { name: 'Kachumbari', description: 'Fresh tomato and onion salad', price: 120.00, category_id: categoryMap['Sides'], in_stock: 40, image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400' },
        
        // Snacks
        { name: 'Mandazi', description: 'Sweet fried bread', price: 50.00, category_id: categoryMap['Snacks'], in_stock: 60, image_url: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400' },
        { name: 'Samosa', description: 'Crispy pastry with spiced filling', price: 80.00, category_id: categoryMap['Snacks'], in_stock: 45, image_url: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400' }
      ].filter(product => product.category_id); // Only add products where category exists

      if (productsToAdd.length > 0) {
        await supabase.from('products').insert(productsToAdd);
      }
    }

    return { success: true, message: 'Sample data added successfully!' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
