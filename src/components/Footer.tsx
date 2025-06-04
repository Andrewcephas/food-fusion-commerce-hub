
import React from 'react';
import { Separator } from '@/components/ui/separator';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-xl font-bold">FoodHub</span>
            </div>
            <p className="text-gray-400 mb-4">
              Delivering fresh, delicious food to your doorstep since 2020. 
              Quality ingredients, exceptional service.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div>📧 hello@foodhub.com</div>
              <div>📞 (555) 123-4567</div>
              <div>📍 123 Food Street, City, State</div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#menu" className="hover:text-orange-500 transition-colors">Menu</a></li>
              <li><a href="#about" className="hover:text-orange-500 transition-colors">About Us</a></li>
              <li><a href="#contact" className="hover:text-orange-500 transition-colors">Contact</a></li>
              <li><a href="#locations" className="hover:text-orange-500 transition-colors">Locations</a></li>
              <li><a href="#careers" className="hover:text-orange-500 transition-colors">Careers</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Customer Service</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#help" className="hover:text-orange-500 transition-colors">Help Center</a></li>
              <li><a href="#tracking" className="hover:text-orange-500 transition-colors">Order Tracking</a></li>
              <li><a href="#returns" className="hover:text-orange-500 transition-colors">Returns</a></li>
              <li><a href="#privacy" className="hover:text-orange-500 transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-orange-500 transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Business Hours</h3>
            <div className="space-y-2 text-gray-400 text-sm">
              <div className="flex justify-between">
                <span>Monday - Thursday</span>
                <span>11:00 AM - 10:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Friday - Saturday</span>
                <span>11:00 AM - 11:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span>12:00 PM - 9:00 PM</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Facebook</a>
                <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Instagram</a>
                <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Twitter</a>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-gray-700" />
        
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <div>
            © 2024 FoodHub. All rights reserved.
          </div>
          <div className="mt-4 md:mt-0">
            Made with ❤️ for food lovers everywhere
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
