import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ArrowRight, 
  Recycle, 
  Users, 
  ShoppingBag, 
  Leaf,
  ChevronLeft,
  ChevronRight,
  Star
} from 'lucide-react';
import { productsApi } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../contexts/AuthContext';

/**
 * Modern home page with hero section and featured products carousel
 */
const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const products = await productsApi.getFeatured(6);
      setFeaturedProducts(products);
    } catch (error) {
      console.error('Error loading featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/browse');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-emerald-700 text-white min-h-screen flex items-center">
        <div className="w-full max-w-none px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  EcoTrade
                </h1>
                <h2 className="text-2xl lg:text-4xl font-medium text-green-100">
                  Moda Sostenible en Costa Rica
                </h2>
                <p className="text-xl text-green-50 leading-relaxed">
                  Descubre ropa de segunda mano única, vende piezas que ya no uses, y contribuye a un futuro más sostenible.
                </p>
              </div>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="max-w-2xl">
                <div className="flex bg-white rounded-2xl overflow-hidden shadow-lg gap-2">
                  <div className="flex-1 flex items-center px-6">
                    <Search className="w-6 h-6 text-gray-400 mr-3" />
                    <Input
                      type="text"
                      placeholder="Buscar productos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="border-none shadow-none text-gray-900 focus:ring-0 bg-transparent text-lg py-4"
                    />
                  </div>
                  <Button type="submit" className="bg-gray-900 hover:bg-gray-800 rounded-2xl px-10 py-4 text-lg my-2 mr-2">
                    Buscar
                  </Button>
                </div>
              </form>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/browse">
                  <Button size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-green-600 w-full sm:w-auto text-lg px-8 py-4">
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Empezar a Explorar
                  </Button>
                </Link>
                {!isLoggedIn && (
                  <Link to="/register">
                    <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 w-full sm:w-auto text-lg px-8 py-4 font-semibold">
                      Crear Cuenta
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                )}
              </div>

              {/* Category Links */}
              <div className="space-y-3">
                <p className="text-green-100 text-sm font-medium">O explora por categoría:</p>
                <div className="flex flex-wrap gap-2">
                  {['Vestidos', 'Camisas', 'Pantalones', 'Zapatos'].map((category) => (
                    <Button
                      key={category}
                      variant="ghost"
                      size="sm"
                      className="bg-green-800/50 text-white hover:bg-green-800/70 rounded-full"
                      onClick={() => navigate(`/browse?category=${category.toLowerCase()}`)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/15 backdrop-blur-sm rounded-3xl p-8 text-center border border-white/20">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Recycle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">100% Sostenible</h3>
                <p className="text-green-100 text-lg">Reduce tu huella</p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-3xl p-8 text-center border border-white/20">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Comunidad Local</h3>
                <p className="text-green-100 text-lg">Costa Rica unida</p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-3xl p-8 text-center border border-white/20">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Precios Justos</h3>
                <p className="text-green-100 text-lg">Moda accesible</p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-3xl p-8 text-center border border-white/20">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Leaf className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Eco-friendly</h3>
                <p className="text-green-100 text-lg">Cuida el planeta</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Encuentra tu Próximo Outfit Favorito
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Busca entre miles de prendas únicas y sostenibles
            </p>
          </div>

          {/* Search Filters */}
          <div className="max-w-4xl mx-auto mb-16">
            <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <Input
                  type="text"
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option>Categoría</option>
                <option>Vestidos</option>
                <option>Camisas</option>
                <option>Pantalones</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option>Género</option>
                <option>Femenino</option>
                <option>Masculino</option>
                <option>Unisex</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option>Todas</option>
                <option>Nuevo</option>
                <option>Poco uso</option>
                <option>Usado</option>
              </select>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                <Search className="w-4 h-4 mr-2" />
                Buscar
              </Button>
            </form>
          </div>

          {/* Featured Products */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Productos Destacados</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="rounded-full">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="rounded-full">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
                    <div className="aspect-square bg-gray-200"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : featuredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                <div className="text-center">
                  <Link to="/browse">
                    <Button size="lg" variant="outline" className="px-8">
                      Ver Todos los Productos
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No hay productos destacados
                </h3>
                <p className="text-gray-600 mb-6">
                  ¡Sé el primero en publicar productos increíbles!
                </p>
                <Link to="/browse">
                  <Button>Explorar Todos los Productos</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
