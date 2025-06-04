
import React from 'react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Delicious Food,
            <br />
            <span className="text-yellow-300">Delivered Fresh</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 animate-fade-in">
            Order from our extensive menu of freshly prepared meals, delivered hot to your door
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
              Order Now
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-3 text-lg">
              View Menu
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
