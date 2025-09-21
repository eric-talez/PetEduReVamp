/**
 * @deprecated This page has been deprecated - BROKEN REDIRECT
 * 
 * DEPRECATED: This shop-simple page redirects to ShopBasicPage which doesn't exist,
 * making this page completely broken. The canonical shop implementation is now
 * at /pages/shop/index.tsx which provides comprehensive e-commerce functionality.
 * 
 * Please use the main shop pages instead: /shop
 * This file will be removed in a future version.
 * 
 * Migration: Remove references to shop-simple and use /shop routes
 */

import React from 'react';
// BROKEN: ShopBasicPage doesn't exist
// import ShopBasicPage from '../ShopBasicPage';

export default function ShopSimplePage() {
  console.log("DEPRECATED: ShopSimplePage - redirecting to main shop");
  
  // Redirect to main shop instead of broken ShopBasicPage
  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Deprecated Page</h1>
      <p className="text-gray-600 mb-4">This page has been deprecated. Please use the main shop.</p>
      <a href="/shop" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Go to Shop
      </a>
    </div>
  );
}