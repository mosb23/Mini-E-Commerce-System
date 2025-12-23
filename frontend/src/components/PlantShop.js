import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, Star, Mail, Phone } from 'lucide-react';
import { createOrder, fetchProducts } from '../api/api';

export default function PlantShop() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: ''
  });

  // Default placeholder images for products
  const defaultImages = [
    'https://websitedemos.net/generic-ecommerce-02/wp-content/uploads/sites/1526/2025/03/product-04-400x434.jpg',
    'https://websitedemos.net/generic-ecommerce-02/wp-content/uploads/sites/1526/2025/03/product-05-400x434.jpg',
    'https://websitedemos.net/generic-ecommerce-02/wp-content/uploads/sites/1526/2025/03/product-06-400x434.jpg',
    'https://websitedemos.net/generic-ecommerce-02/wp-content/uploads/sites/1526/2025/03/product-03-400x434.jpg',
  ];

  // Fetch products from backend
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setProductsLoading(true);
        setProductsError(null);
        const data = await fetchProducts();
        
        // Map backend data to frontend format
        // Backend has: id, name, description, price, stock
        // Frontend needs: id, name, category, price, image
        const mappedProducts = data.map((product, index) => ({
          id: product.id,
          name: product.name,
          description: product.description || '',
          price: parseFloat(product.price), // Convert DecimalField to number
          stock: product.stock || 0,
          category: 'Indoor Plants', // Default category since backend doesn't have it
          image: product.image || defaultImages[index % defaultImages.length], // Use default image if not provided
        }));
        
        setProducts(mappedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProductsError(error.message || 'Failed to load products');
        // Fallback to empty array on error
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };

    loadProducts();
  }, []);


  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMobileMenuOpen(false); // Close mobile menu after clicking
    }
  };

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setSelectedProduct(null);
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
    // Show a brief notification
    alert(`${product.name} added to cart!`);
    // Close modal after adding to cart
    if (showProductModal) {
      closeProductModal();
    }
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    // Show checkout form instead of directly placing order
    setCartOpen(false);
    setShowCheckoutForm(true);
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!customerInfo.name.trim() || !customerInfo.phone.trim() || !customerInfo.address.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setCheckoutLoading(true);
    try {
      // Format items for the API
      const items = cart.map(({ id, quantity }) => ({
        product_id: id,
        quantity: quantity
      }));

      // Create order via API with customer information
      const order = await createOrder(items, customerInfo);
      
      // Success message
      alert(`Order placed successfully!\nOrder ID: ${order.id}\nTotal: ${getTotalPrice().toFixed(2)} EGP\n\nYour order will be delivered to:\n${customerInfo.name}\n${customerInfo.phone}\n${customerInfo.address}`);
      
      // Clear cart, form, and close checkout
      setCart([]);
      setCustomerInfo({ name: '', phone: '', address: '' });
      setShowCheckoutForm(false);
      
      // Refresh products to update stock
      try {
        const productData = await fetchProducts();
        const mappedProducts = productData.map((product, index) => ({
          id: product.id,
          name: product.name,
          description: product.description || '',
          price: parseFloat(product.price),
          stock: product.stock || 0,
          category: 'Indoor Plants',
          image: product.image || defaultImages[index % defaultImages.length],
        }));
        setProducts(mappedProducts);
      } catch (error) {
        console.error('Error refreshing products:', error);
      }
      
    } catch (error) {
      console.error('Checkout error:', error);
      const errorMessage = error.message || "Failed to place order. Please try again.";
      alert(`Error: ${errorMessage}`);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        {/* Main Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo - Ecoplanta */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-green-600">Ecoplanta</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <button onClick={() => scrollToSection('home')} className="text-gray-900 hover:text-green-600 font-medium">Home</button>
              <button onClick={() => scrollToSection('shop')} className="text-gray-600 hover:text-green-600 font-medium">Shop</button>
              <button onClick={() => scrollToSection('about')} className="text-gray-600 hover:text-green-600 font-medium">About</button>
              <button onClick={() => scrollToSection('contact')} className="text-gray-600 hover:text-green-600 font-medium">Contact</button>
            </nav>

            {/* Cart Icon */}
            <div className="flex items-center space-x-4">
              <button onClick={() => setCartOpen(!cartOpen)} className="relative text-gray-600 hover:text-green-600">
                <ShoppingCart className="h-6 w-6" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>
              
              {/* Mobile Menu Button */}
              <button className="md:hidden text-gray-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <nav className="px-4 py-4 space-y-3">
              <button onClick={() => scrollToSection('home')} className="block text-gray-900 hover:text-green-600 font-medium w-full text-left">Home</button>
              <button onClick={() => scrollToSection('shop')} className="block text-gray-600 hover:text-green-600 font-medium w-full text-left">Shop</button>
              <button onClick={() => scrollToSection('about')} className="block text-gray-600 hover:text-green-600 font-medium w-full text-left">About</button>
              <button onClick={() => scrollToSection('contact')} className="block text-gray-600 hover:text-green-600 font-medium w-full text-left">Contact</button>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="relative bg-gradient-to-r from-green-50 to-emerald-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-green-600 font-medium mb-4">Welcome to Ecoplanta</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Discover the Beauty of Nature at Your Fingertips
            </h1>
            <button onClick={() => scrollToSection('shop')} className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-md transition-colors">
              Shop Now
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <h3 className="font-bold text-gray-900 mb-2">Secure Payment</h3>
              <p className="text-sm text-gray-600">Elementum feugiat diam</p>
            </div>
            <div className="text-center">
              <h3 className="font-bold text-gray-900 mb-2">Free Shipping</h3>
              <p className="text-sm text-gray-600">For 50 EGP order</p>
            </div>
            <div className="text-center">
              <h3 className="font-bold text-gray-900 mb-2">Delivered with Care</h3>
              <p className="text-sm text-gray-600">Lacinia pellentesque leo</p>
            </div>
            <div className="text-center">
              <h3 className="font-bold text-gray-900 mb-2">Excellent Service</h3>
              <p className="text-sm text-gray-600">Blandit gravida viverra</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section id="shop" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Trending Products</h2>
          {productsLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading products...</p>
            </div>
          ) : productsError ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">Error: {productsError}</p>
              <p className="text-gray-600 text-sm">Please make sure the backend server is running.</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No products available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.slice(0, 3).map((product) => (
                <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow group cursor-pointer" onClick={() => openProductModal(product)}>
                  <div className="relative overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300" />
                    <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="absolute bottom-4 right-4 bg-white hover:bg-green-600 text-gray-900 hover:text-white font-semibold px-6 py-2 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                      Add to cart
                    </button>
                  </div>
                  <div className="p-6">
                    <div className="flex text-yellow-400 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4" fill="currentColor" />
                      ))}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                    <p className="text-lg font-bold text-gray-900">{product.price} EGP</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Flash Sale Banner */}
      <section className="py-20 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Flash Sale: Up to 50% Off On Select Items!
          </h2>
          <p className="text-green-50 mb-8 max-w-2xl mx-auto">
            Don't miss out on our flash sale event! For a limited time, enjoy up to 50% off on a selection of our best-selling products.
          </p>
          <button onClick={() => scrollToSection('shop')} className="bg-white hover:bg-gray-100 text-green-600 font-semibold px-8 py-3 rounded-md transition-colors">
            Shop Now
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img src="https://websitedemos.net/generic-ecommerce-02/wp-content/uploads/sites/1526/2025/03/stats-count.jpg" alt="Plants" className="rounded-lg shadow-lg w-full" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Your Premier Destination for All Green.
              </h2>
              <p className="text-gray-600 mb-8">
                At Ecoplanta, we believe in the transformative power of plants. Whether you're a seasoned gardener or just starting your green journey, our curated selection of plants will inspire and enrich your living space.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-4xl font-bold text-green-600 mb-2">98%</h3>
                  <p className="text-gray-600">Customer Satisfaction</p>
                </div>
                <div>
                  <h3 className="text-4xl font-bold text-green-600 mb-2">103K</h3>
                  <p className="text-gray-600">Plants Sold</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop All Products */}
      <section id="shop-all" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Shop All Products</h2>
          {productsLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading products...</p>
            </div>
          ) : productsError ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">Error: {productsError}</p>
              <p className="text-gray-600 text-sm">Please make sure the backend server is running.</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No products available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow group cursor-pointer" onClick={() => openProductModal(product)}>
                  <div className="relative overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300" />
                    <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="absolute bottom-4 right-4 bg-white hover:bg-green-600 text-gray-900 hover:text-white font-semibold px-6 py-2 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                      Add to cart
                    </button>
                  </div>
                  <div className="p-6">
                    <div className="flex text-yellow-400 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4" fill="currentColor" />
                      ))}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                    <p className="text-lg font-bold text-gray-900">{product.price} EGP</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Find your Perfect Plant?
          </h2>
          <p className="text-green-50 mb-8 max-w-2xl mx-auto">
            Browse our online store or visit us in person to experience the beauty of nature.
          </p>
          <button onClick={() => scrollToSection('shop')} className="bg-white hover:bg-gray-100 text-green-600 font-semibold px-8 py-3 rounded-md transition-colors">
            Shop Now
          </button>
        </div>
      </section>

      {/* Cart Sidebar */}
      <div className={`fixed top-0 right-0 h-screen w-80 bg-white shadow-2xl z-50 transform ${cartOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 flex flex-col`}>
        {/* Cart Header */}
        <div className="p-6 flex justify-between items-center border-b border-gray-200 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900">Your Cart</h2>
          <button onClick={() => setCartOpen(false)} className="text-gray-600 hover:text-red-500 text-2xl font-bold">
            ×
          </button>
        </div>
        
        {/* Cart Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {cart.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <p className="text-gray-600 text-center">Your cart is empty</p>
            </div>
          ) : (
            <>
              {/* Cart Items - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3 flex-1">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
                        <p className="text-gray-600 text-sm">{item.price} EGP</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                      >
                        −
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Checkout Section - Fixed at Bottom */}
              <div className="border-t border-gray-200 p-6 bg-gray-50 flex-shrink-0">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-xl font-bold text-green-600">{getTotalPrice().toFixed(2)} EGP</span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={checkoutLoading || cart.length === 0}
                  className={`w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-md transition-colors ${
                    checkoutLoading || cart.length === 0
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  {checkoutLoading ? 'Processing...' : 'Checkout'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Cart Overlay */}
      {cartOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setCartOpen(false)}
        />
      )}

      {/* Checkout Form Modal */}
      {showCheckoutForm && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setShowCheckoutForm(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
                  <button
                    onClick={() => setShowCheckoutForm(false)}
                    className="text-gray-600 hover:text-red-500 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>

                {/* Order Summary */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
                  <div className="space-y-2 mb-3">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.name} x {item.quantity}</span>
                        <span className="text-gray-900">{(item.price * item.quantity).toFixed(2)} EGP</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <span className="font-semibold text-gray-900">Total:</span>
                    <span className="text-xl font-bold text-green-600">{getTotalPrice().toFixed(2)} EGP</span>
                  </div>
                </div>

                {/* Checkout Form */}
                <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={customerInfo.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Address *
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      value={customerInfo.address}
                      onChange={handleInputChange}
                      required
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter your delivery address"
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCheckoutForm(false)}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={checkoutLoading}
                      className={`flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition-colors ${
                        checkoutLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {checkoutLoading ? 'Placing Order...' : 'Place Order'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Product Detail Modal */}
      {showProductModal && selectedProduct && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={closeProductModal}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex flex-col md:flex-row">
                {/* Product Image */}
                <div className="md:w-1/2">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name} 
                    className="w-full h-96 md:h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                  />
                </div>
                
                {/* Product Details */}
                <div className="md:w-1/2 p-6 md:p-8 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-3xl font-bold text-gray-900">{selectedProduct.name}</h2>
                    <button
                      onClick={closeProductModal}
                      className="text-gray-600 hover:text-red-500 text-2xl font-bold ml-4"
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="flex text-yellow-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5" fill="currentColor" />
                    ))}
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-4">{selectedProduct.category}</p>
                  
                  <p className="text-3xl font-bold text-green-600 mb-6">{selectedProduct.price} EGP</p>
                  
                  {selectedProduct.description && (
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                      <p className="text-gray-600 leading-relaxed">{selectedProduct.description}</p>
                    </div>
                  )}
                  
                  {selectedProduct.stock !== undefined && (
                    <div className="mb-6">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Stock:</span> {selectedProduct.stock} available
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-auto pt-6">
                    <button
                      onClick={() => addToCart(selectedProduct)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-md transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-green-400 mb-4">Ecoplanta</h2>
              <p className="text-gray-400 text-sm">Your premier destination for all green.</p>
            </div>
            <div>
              <h3 className="font-bold mb-3">Menu</h3>
              <nav className="space-y-2">
                <button onClick={() => scrollToSection('home')} className="block text-gray-400 hover:text-white text-left">Home</button>
                <button onClick={() => scrollToSection('shop')} className="block text-gray-400 hover:text-white text-left">Shop</button>
                <button onClick={() => scrollToSection('about')} className="block text-gray-400 hover:text-white text-left">About</button>
                <button onClick={() => scrollToSection('contact')} className="block text-gray-400 hover:text-white text-left">Contact</button>
              </nav>
            </div>
            <div>
              <h3 className="font-bold mb-3">Contact Us</h3>
              <div className="space-y-2">
                <a href="mailto:mosb23@gmail.com" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">mosb23@gmail.com</span>
                </a>
                <a href="tel:01028239305" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">01028239305</span>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            Copyright © 2025 Ecoplanta
          </div>
        </div>
      </footer>
    </div>
  );
}
