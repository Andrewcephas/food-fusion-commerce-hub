
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import AuthModal from './AuthModal';
import CartSidebar from './CartSidebar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user, profile, signOut, isAdmin } = useAuth();
  const { itemCount } = useCart();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const scrollToMenu = () => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-orange-600">Kenya Eats</h1>
              <p className="text-sm text-gray-600 hidden sm:block">Authentic Kenyan Cuisine</p>
            </div>

            <nav className="hidden md:flex items-center space-x-6">
              <button 
                onClick={scrollToMenu}
                className="text-gray-700 hover:text-orange-600 transition-colors"
              >
                Menu
              </button>
              {isAdmin && (
                <a href="/admin" className="text-gray-700 hover:text-orange-600 transition-colors">
                  Admin Dashboard
                </a>
              )}
              <a href="/pos" className="text-gray-700 hover:text-orange-600 transition-colors">
                POS System
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              {/* Cart Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCartOpen(true)}
                className="relative"
              >
                <ShoppingCart className="w-4 h-4" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-orange-500">
                    {itemCount}
                  </Badge>
                )}
              </Button>

              {/* User Authentication */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <User className="w-4 h-4 mr-2" />
                      {profile?.full_name || 'User'}
                      {isAdmin && <Badge className="ml-2" variant="secondary">Admin</Badge>}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Settings className="w-4 h-4 mr-2" />
                      Profile Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
      
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </>
  );
};

export default Header;
