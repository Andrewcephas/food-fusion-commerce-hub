
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero />
      <main className="container mx-auto px-4 py-8">
        <ProductGrid />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
