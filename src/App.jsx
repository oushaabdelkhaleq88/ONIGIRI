/*App.jsx*/ 
import React, { useState, useEffect, createContext, useContext } from 'react';
import { Menu, X, Star, Clock, MapPin, Phone, Mail, ShoppingCart, Plus, Minus, ArrowLeft } from 'lucide-react';
import Checkout from './Pages/Checkout';


// Cart Context
const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id);
      if (existing) {
        return prev.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map(item =>
          item.id === itemId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prev.filter(item => item.id !== itemId);
    });
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      getTotalPrice, 
      getTotalItems,
      clearCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Simple Router Implementation
const Router = ({ children, currentPage, setCurrentPage }) => {
  return (
    <div>
      {React.Children.map(children, child => 
        React.cloneElement(child, { currentPage, setCurrentPage })
      )}
    </div>
  );
};

const Route = ({ path, component: Component, currentPage, setCurrentPage }) => {
  if (currentPage === path) {
    return <Component setCurrentPage={setCurrentPage} />;
  }
  return null;
};

// Cart Page Component
const Cart = ({ setCurrentPage }) => {
  const { cart, addToCart, removeFromCart, getTotalPrice, getTotalItems, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <button 
              onClick={() => setCurrentPage('home')}
              className="mb-8 flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors mx-auto"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Menu
            </button>
            <div className="text-6xl mb-6">🍙</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Add some delicious onigiri to get started!</p>
            <button 
              onClick={() => setCurrentPage('home')}
              className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Browse Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Menu
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Your Cart ({getTotalItems()} items)</h1>
          <button 
            onClick={clearCart}
            className="text-gray-500 hover:text-red-600 transition-colors"
          >
            Clear Cart
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="space-y-6">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                  <div className="text-red-600 font-semibold mt-1">${item.price}</div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-lg font-semibold min-w-[2rem] text-center">{item.quantity}</span>
                  <button 
                    onClick={() => addToCart(item)}
                    className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-lg font-bold text-gray-900 min-w-[4rem] text-right">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t mt-8 pt-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-2xl font-bold text-gray-900">Total: ${getTotalPrice()}</span>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setCurrentPage('home')}
                className="flex-1 border border-gray-300 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </button>
              <button 
                onClick={() => setCurrentPage('checkout')}
                className="flex-1 bg-red-600 text-white py-4 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Home Page Component (Original Restaurant Component)
const HomePage = ({ setCurrentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);
  const { cart, addToCart, removeFromCart, getTotalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    {
      id: 1,
      name: 'Classic Salmon Onigiri',
      price: 3.50,
      description: 'Fresh grilled salmon with seasoned rice and nori',
      image: 'https://mikhaeats.com/wp-content/uploads/2023/10/salmon-onigiri-featured-image-1.jpg',
      category: 'traditional'
    },
    {
      id: 2,
      name: 'Spicy Tuna Onigiri',
      price: 4.00,
      description: 'Spicy tuna mix with mayo and sriracha',
      image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=300',
      category: 'fusion'
    },
    {
      id: 3,
      name: 'Vegetarian Umeboshi',
      price: 2.80,
      description: 'Traditional pickled plum with seasoned rice',
      image: 'data:image/jpeg;base64,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',
      category: 'traditional'
    },
    {
      id: 4,
      name: 'Teriyaki Chicken',
      price: 3.80,
      description: 'Grilled chicken with homemade teriyaki glaze',
      image: 'https://www.budgetbytes.com/wp-content/uploads/2022/04/Teriyaki-Chicken-plate.jpg',
      category: 'modern'
    },
    {
      id: 5,
      name: 'Avocado Wasabi',
      price: 3.20,
      description: 'Creamy avocado with a hint of wasabi kick',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300',
      category: 'fusion'
    },
    {
      id: 6,
      name: 'Katsuobushi Special',
      price: 4.50,
      description: 'Premium bonito flakes with traditional seasoning',
      image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=300',
      category: 'premium'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-lg' : 'bg-black/20 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className={`text-4xl font-bold drop-shadow-lg transition-colors ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}>🍙 ONIGIRI</h1>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-20 flex items-center space-x-8">
                <a href="#hero" className={`transition-colors font-medium drop-shadow-md ${
                  isScrolled ? 'text-gray-900 hover:text-red-600' : 'text-white hover:text-red-400'
                }`}>Home</a>
                <a href="#menu" className={`transition-colors font-medium drop-shadow-md ${
                  isScrolled ? 'text-gray-900 hover:text-red-600' : 'text-white hover:text-red-400'
                }`}>Menu</a>
                <a href="#about" className={`transition-colors font-medium drop-shadow-md ${
                  isScrolled ? 'text-gray-900 hover:text-red-600' : 'text-white hover:text-red-400'
                }`}>About</a>
                <a href="#contact" className={`transition-colors font-medium drop-shadow-md ${
                  isScrolled ? 'text-gray-900 hover:text-red-600' : 'text-white hover:text-red-400'
                }`}>Contact</a>
                <button 
                  onClick={() => setCurrentPage('cart')}
                  className={`relative p-2 transition-colors flex items-center ${
                    isScrolled ? 'text-gray-900 hover:text-red-600' : 'text-white hover:text-red-400'
                  }`}
                >
                  <ShoppingCart className="h-6 w-6 drop-shadow-md" />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </button>
              </div>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`transition-colors ${
                isScrolled ? 'text-gray-900 hover:text-red-600' : 'text-white hover:text-red-400'
              }`}>
                {isMenuOpen ? <X className="h-6 w-6 drop-shadow-md" /> : <Menu className="h-6 w-6 drop-shadow-md" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/95 backdrop-blur-sm">
          <div className="pt-20 pb-3 space-y-1">
            <a href="#hero" className="block px-3 py-2 text-base font-medium text-white hover:text-red-400 transition-colors">Home</a>
            <a href="#menu" className="block px-3 py-2 text-base font-medium text-white hover:text-red-400 transition-colors">Menu</a>
            <a href="#about" className="block px-3 py-2 text-base font-medium text-white hover:text-red-400 transition-colors">About</a>
            <a href="#contact" className="block px-3 py-2 text-base font-medium text-white hover:text-red-400 transition-colors">Contact</a>
            <button 
              onClick={() => {
                setCurrentPage('cart');
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-base font-medium text-white hover:text-red-400 transition-colors"
            >
              Cart ({getTotalItems()})
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img 
            src="/ONIGIRI/Background.jpg" 
            alt="Background" 
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-black/50 md:bg-black/40"></div>
        
        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full animate-bounce delay-100"></div>
        <div className="absolute top-40 right-20 w-20 h-20 bg-white/5 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-32 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-bounce delay-500"></div>
        
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 drop-shadow-2xl">
              <span className="text-6xl md:text-8xl lg:text-9xl drop-shadow-2xl filter drop-shadow-[0_0_20px_rgba(0,0,0,0.6)]">🍙</span>
              <br />
              ONIGIRI
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-white font-medium mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-lg bg-gradient-to-r from-black/20 via-black/25 to-black/20 px-8 py-6 rounded-3xl backdrop-blur-md border border-white/10">
              Authentic Japanese rice balls crafted with love and tradition. 
              Experience the perfect harmony of flavors in every bite.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#menu" className="bg-red-600 text-white px-8 py-4 rounded-full font-bold hover:bg-red-700 transform hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-2xl hover:shadow-red-500/50 hover:shadow-2xl hover:shadow-red-600/60 border-2 border-red-500 active:scale-95">
                Explore Menu
              </a>
              <a href="#about" className="border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-red-800 transform hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-2xl backdrop-blur-sm active:scale-95">
                Our Story
              </a>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center shadow-lg bg-black/20 backdrop-blur-sm">
              <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse drop-shadow-md"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Menu</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Handcrafted onigiri made fresh daily with premium ingredients and traditional techniques
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {menuItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                <div className="relative overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    ${item.price}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <button 
                    onClick={() => addToCart(item)}
                    className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Story</h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                Founded in the heart of the city, ONIGIRI brings authentic Japanese flavors to your neighborhood. 
                Our master chefs have perfected the art of onigiri making, using time-honored techniques passed down through generations.
              </p>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                Every rice ball is carefully crafted with premium short-grain rice, fresh ingredients, and wrapped in crispy nori. 
                We believe food is more than sustenance – it's a connection to culture, tradition, and community.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400 mb-2">5+</div>
                  <div className="text-gray-300">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400 mb-2">1000+</div>
                  <div className="text-gray-300">Happy Customers</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-red-600/20 rounded-3xl p-8 backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-2xl p-4 text-center backdrop-blur-sm">
                    <Star className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                    <div className="text-sm text-gray-300">Premium Quality</div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-4 text-center backdrop-blur-sm">
                    <Clock className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <div className="text-sm text-gray-300">Fresh Daily</div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-4 text-center backdrop-blur-sm col-span-2">
                    <div className="text-6xl mb-2">🍙</div>
                    <div className="text-sm text-gray-300">Authentic Japanese</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Visit Us</h2>
            <p className="text-xl text-gray-600">Come experience authentic onigiri in a warm, welcoming atmosphere</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow">
              <MapPin className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Location</h3>
              <p className="text-gray-600">
                123 Tokyo Street<br />
                Downtown District<br />
                City, State 12345
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow">
              <Clock className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Hours</h3>
              <p className="text-gray-600">
                Mon - Thu: 11AM - 9PM<br />
                Fri - Sat: 11AM - 10PM<br />
                Sunday: 12PM - 8PM
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow">
              <Phone className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Contact</h3>
              <p className="text-gray-600">
                Phone: (555) 123-4567<br />
                Email: hello@onigiri.com<br />
                Order Online Available
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-4">🍙 ONIGIRI</h3>
            <p className="text-gray-400 mb-6">Authentic Japanese rice balls made with love</p>
            <p className="text-gray-500 text-sm">
              © 2025 ONIGIRI™ – Rice to meet you. All rights reserved… and all rice preserved. 🍙
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Main App Component
const OnigiriRestaurant = () => {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <CartProvider>
      <AppRouter currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </CartProvider>
  );
};

// Router with Cart Context
const AppRouter = ({ currentPage, setCurrentPage }) => {
  const { cart, getTotalPrice, getTotalItems, clearCart } = useCart();
  
  return (
    <Router currentPage={currentPage} setCurrentPage={setCurrentPage}>
      <Route path="home" component={HomePage} />
      <Route path="cart" component={Cart} />
      <Route path="checkout" component={(props) => <Checkout {...props} cart={cart} getTotalPrice={getTotalPrice} getTotalItems={getTotalItems} clearCart={clearCart} />} />
    </Router>
  );
};

export default OnigiriRestaurant;