import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Package, Plus, Filter, ArrowLeft, ShoppingBag, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { productsApi, purchasesApi } from '../services/api';
import { Button } from '../components/ui/button';
import ProductCard from '../components/ProductCard';
import { formatPrice, formatDate, getPlaceholderImage } from '../utils';

const PRODUCT_FILTERS = ['all', 'available', 'sold', 'purchased'];

const getPurchaseStatusLabel = (status) => {
  const labels = {
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    completed: 'Completada',
    cancelled: 'Cancelada',
  };

  return labels[status] || status;
};

const getPurchaseStatusClasses = (status) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-700';
    case 'confirmed':
      return 'bg-blue-100 text-blue-700';
    case 'pending':
      return 'bg-amber-100 text-amber-700';
    case 'cancelled':
      return 'bg-gray-100 text-gray-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

/**
 * My Products page - Shows all user's products in a grid
 */
const MyProducts = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState([]);
  const [purchasesTotal, setPurchasesTotal] = useState(0);
  const [filter, setFilter] = useState(() => {
    const params = new URLSearchParams(location.search);
    const queryFilter = params.get('filter') || params.get('view');
    const stateFilter = location.state?.filter;
    const candidate = queryFilter || stateFilter;
    return candidate && PRODUCT_FILTERS.includes(candidate) ? candidate : 'all';
  }); // all, available, sold, purchased

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const loadProducts = async () => {
      try {
        setLoading(true);
        const [productsData, purchasesResponse] = await Promise.all([
          productsApi.getMyProducts(),
          purchasesApi.getAll({ role: 'buyer', limit: 100 }),
        ]);
        setProducts(productsData);
        const purchaseList = purchasesResponse?.purchases || [];
        const totalPurchases = purchasesResponse?.total ?? purchaseList.length;
        setPurchases(purchaseList);
        setPurchasesTotal(totalPurchases);
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts([]);
        setPurchases([]);
        setPurchasesTotal(0);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryFilter = params.get('filter') || params.get('view');
    const stateFilter = location.state?.filter;
    const candidate = queryFilter || stateFilter;

    if (candidate && PRODUCT_FILTERS.includes(candidate) && candidate !== filter) {
      setFilter(candidate);
    }
  }, [location.search, location.state, filter]);

  const handleFilterChange = (nextFilter) => {
    if (nextFilter === filter) return;

    setFilter(nextFilter);

    const params = new URLSearchParams(location.search);
    if (nextFilter === 'all') {
      params.delete('filter');
      params.delete('view');
    } else {
      params.set('filter', nextFilter);
    }

    const searchString = params.toString();
    navigate(`${location.pathname}${searchString ? `?${searchString}` : ''}`, {
      replace: true,
      state: { filter: nextFilter },
    });
  };

  // Filtrar productos según el estado seleccionado
  const filteredProducts = products.filter(product => {
    if (filter === 'all') return true;
    if (filter === 'available') return product.status === 'available';
    if (filter === 'sold') return product.status === 'sold';
    return true;
  });

  const isPurchasedView = filter === 'purchased';
  const sortedPurchases = [...purchases].sort((a, b) => (
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ));

  const stats = {
    all: products.length,
    available: products.filter(p => p.status === 'available').length,
    sold: products.filter(p => p.status === 'sold').length,
    purchased: purchasesTotal,
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
                onClick={() => handleFilterChange('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Todos ({stats.all})
              </button>
              <button
                onClick={() => handleFilterChange('available')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'available'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Disponibles ({stats.available})
              </button>
              <button
                onClick={() => handleFilterChange('sold')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'sold'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Vendidos ({stats.sold})
              </button>
              <button
                onClick={() => handleFilterChange('purchased')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'purchased'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Comprados ({stats.purchased})
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
        ) : isPurchasedView ? (
          sortedPurchases.length > 0 ? (
            <div className="space-y-6">
              {sortedPurchases.map((purchase) => {
                const product = purchase.product || {};
                const seller = purchase.seller || {};
                const mainImage = Array.isArray(product.images) && product.images.length > 0
                  ? product.images[0]
                  : getPlaceholderImage(320, 320);
                const productLink = product.id ? `/product/${product.id}` : '/browse';

                return (
                  <div key={purchase.id} className="bg-white rounded-xl border border-green-100 shadow-sm overflow-hidden">
                    <div className="p-6">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        <img
                          src={mainImage}
                          alt={product.title || 'Producto'}
                          className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-lg flex-shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-semibold text-gray-900 truncate">
                            {product.title || 'Producto sin título'}
                          </h3>
                          {seller.full_name && (
                            <p className="text-sm text-gray-500">Vendedor: {seller.full_name}</p>
                          )}
                          <p className="text-sm text-gray-500">Fecha de compra: {formatDate(purchase.created_at)}</p>
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">
                            {formatPrice(product.price || 0)}
                          </p>
                          <span className={`text-xs px-3 py-1 rounded-full ${getPurchaseStatusClasses(purchase.status)}`}>
                            {getPurchaseStatusLabel(purchase.status)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2 justify-end">
                        <Link to={productLink}>
                          <Button variant="outline" size="sm">
                            Ver producto
                          </Button>
                        </Link>
                        <Link to="/chats" state={{ purchaseId: purchase.id }}>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white gap-2">
                            <MessageCircle className="w-4 h-4" />
                            Abrir chat
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-green-100 p-16 text-center shadow-sm">
              <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Aún no has comprado productos
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Explora el catálogo de EcoTrade y encuentra prendas únicas para tu guardarropa sostenible.
              </p>
              <Link to="/browse">
                <Button className="bg-green-600 hover:bg-green-700">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Explorar productos
                </Button>
              </Link>
            </div>
          )
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
