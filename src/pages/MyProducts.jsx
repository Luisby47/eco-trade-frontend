import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Plus, Filter, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { productsApi } from '../services/api';
import { Button } from '../components/ui/button';
import ProductCard from '../components/ProductCard';

/**
 * My Products page - Shows all user's products in a grid
 */
const MyProducts = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, available, sold

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await productsApi.getMyProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [isLoggedIn, navigate]);

  // Filtrar productos según el estado seleccionado
  const filteredProducts = products.filter(product => {
    if (filter === 'all') return true;
    if (filter === 'available') return product.status === 'available';
    if (filter === 'sold') return product.status === 'sold';
    return true;
  });

  const stats = {
    all: products.length,
    available: products.filter(p => p.status === 'available').length,
    sold: products.filter(p => p.status === 'sold').length,
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/profile')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Perfil
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Mis Productos
              </h1>
              <p className="text-gray-600">
                Administra tu catálogo de productos publicados
              </p>
            </div>
            
            <Link to="/post">
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Publicar Producto
              </Button>
            </Link>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl border border-green-100 p-2 mb-8 shadow-sm">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500 ml-2" />
            <div className="flex gap-2 flex-1">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Todos ({stats.all})
              </button>
              <button
                onClick={() => setFilter('available')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'available'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Disponibles ({stats.available})
              </button>
              <button
                onClick={() => setFilter('sold')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'sold'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Vendidos ({stats.sold})
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-green-100 p-16 text-center shadow-sm">
            <Package className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {filter === 'all' && 'No tienes productos publicados'}
              {filter === 'available' && 'No tienes productos disponibles'}
              {filter === 'sold' && 'No has vendido productos aún'}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {filter === 'all' && 'Comienza a vender tu ropa de segunda mano y contribuye a la moda sostenible'}
              {filter === 'available' && 'Todos tus productos están vendidos o no tienes productos publicados'}
              {filter === 'sold' && 'Cuando vendas tu primer producto, aparecerá aquí'}
            </p>
            {filter === 'all' && (
              <Link to="/post">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Publicar Primer Producto
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProducts;
