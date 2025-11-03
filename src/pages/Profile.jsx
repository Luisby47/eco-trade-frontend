import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Package, User, Plus, ShoppingBag, MessageCircle, Edit, Save, X, Camera, ShoppingCart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { productsApi, reviewsApi, usersApi, purchasesApi } from '../services/api';
import ProductCard from '../components/ProductCard';
import { formatPrice, formatDate, getPlaceholderImage } from '../utils';

/**
 * Enhanced user profile page matching reference design
 */
const Profile = () => {
  const { id } = useParams();
  const { user, isLoggedIn, updateUser } = useAuth();
  
  // Estados para edición
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  
  // Estados para productos
  const [myProducts, setMyProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [purchases, setPurchases] = useState([]);
  const [loadingPurchases, setLoadingPurchases] = useState(true);
  const [stats, setStats] = useState({
    available: 0,
    sold: 0,
    purchased: 0,
  });

  // Estados para reviews
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // Estados para imagen de perfil
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);
  
  // For MVP, just show current user's profile
  const isOwnProfile = !id || (user && id === user.id);
  const profileUser = isOwnProfile ? user : null;

  // Inicializar datos de edición cuando el usuario cambie
  useEffect(() => {
    if (user) {
      setEditData({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        gender: user.gender || ''
      });
    }
  }, [user]);

  // Cargar productos del usuario
  useEffect(() => {
    const loadMyProducts = async () => {
      if (!isOwnProfile || !user) {
        setLoadingProducts(false);
        return;
      }

      try {
        setLoadingProducts(true);
        const products = await productsApi.getMyProducts();
        setMyProducts(products);

        // Calcular estadísticas
        const available = products.filter(p => p.status === 'available').length;
        const sold = products.filter(p => p.status === 'sold').length;
  setStats((prev) => ({ ...prev, available, sold }));
      } catch (error) {
        console.error('Error loading products:', error);
        setMyProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadMyProducts();
  }, [isOwnProfile, user]);

  // Cargar compras del usuario
  useEffect(() => {
    const loadPurchases = async () => {
      if (!isOwnProfile || !user) {
        setLoadingPurchases(false);
        return;
      }

      try {
        setLoadingPurchases(true);
        const response = await purchasesApi.getAll({ role: 'buyer', limit: 5 });
        const list = response?.purchases || [];
        setPurchases(list);

        const totalPurchases = response?.total ?? list.length;
        setStats((prev) => ({ ...prev, purchased: totalPurchases }));
      } catch (error) {
        console.error('Error loading purchases:', error);
        setPurchases([]);
      } finally {
        setLoadingPurchases(false);
      }
    };

    loadPurchases();
  }, [isOwnProfile, user]);

  // Cargar reviews del usuario
  useEffect(() => {
    const loadReviews = async () => {
      if (!profileUser) {
        setLoadingReviews(false);
        return;
      }

      try {
        setLoadingReviews(true);
        const reviewsData = await reviewsApi.getByUser(profileUser.id, { limit: 5 });
        setReviews(reviewsData.reviews || []);
      } catch (error) {
        console.error('Error loading reviews:', error);
        setReviews([]);
      } finally {
        setLoadingReviews(false);
      }
    };

    loadReviews();
  }, [profileUser]);

  // Funciones para manejar la edición
  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Restaurar datos originales
    setEditData({
      full_name: user.full_name || '',
      email: user.email || '',
      phone: user.phone || '',
      location: user.location || '',
      gender: user.gender || ''
    });
  };

  const handleSaveEdit = async () => {
    try {
      const payload = {
        full_name: editData.full_name?.trim(),
        phone: editData.phone?.trim(),
        location: editData.location?.trim(),
        gender: editData.gender,
      };

      const sanitizedPayload = Object.fromEntries(
        Object.entries(payload).filter(([key, value]) => {
          if (value === undefined || value === null) return false;
          if (typeof value === 'string') {
            const normalized = value.trim();
            if (normalized.length === 0) {
              return key === 'location';
            }
            payload[key] = normalized;
          }
          if (key === 'gender' && value === '') {
            return false;
          }
          return true;
        }),
      );

      const updatedUser = await usersApi.updateProfile(sanitizedPayload);

      // Actualizar el contexto del usuario
      updateUser({ ...user, ...updatedUser });

      alert('Información actualizada correctamente');
      setIsEditing(false);
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar la información');
    }
  };

  const handleImageClick = () => {
    if (isOwnProfile) {
      fileInputRef.current?.click();
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida');
      return;
    }

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen debe ser menor a 5MB');
      return;
    }

    try {
      setUploadingImage(true);

      // Convertir a base64
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const base64Image = event.target.result;
          
          // Actualizar perfil con nueva imagen
          const updatedUser = await usersApi.updateProfile({
            profile_picture: base64Image
          });

          // Actualizar contexto con nueva imagen
          updateUser(updatedUser);
          setUploadingImage(false);
        } catch (error) {
          console.error('Error al actualizar imagen:', error);
          alert('Error al actualizar la imagen de perfil');
          setUploadingImage(false);
        }
      };
      reader.onerror = () => {
        alert('Error al leer la imagen');
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error al procesar imagen:', error);
      alert('Error al procesar la imagen');
      setUploadingImage(false);
    }
  };

  if (!isLoggedIn && isOwnProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Inicia sesión para ver tu perfil
          </h2>
          <p className="text-gray-600">
            Necesitas estar autenticado para acceder a esta página.
          </p>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Usuario no encontrado
          </h2>
          <p className="text-gray-600">
            El perfil que buscas no existe o no está disponible.
          </p>
        </div>
      </div>
    );
  }

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

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl border border-green-100 overflow-hidden mb-8 shadow-sm">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative group">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
                  {profileUser.profile_picture ? (
                    <img 
                      src={profileUser.profile_picture} 
                      alt={profileUser.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-white" />
                  )}
                </div>
                {isOwnProfile && (
                  <>
                    <button
                      onClick={handleImageClick}
                      disabled={uploadingImage}
                      className="absolute inset-0 w-24 h-24 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-not-allowed"
                    >
                      {uploadingImage ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                      ) : (
                        <Camera className="w-6 h-6 text-white" />
                      )}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </>
                )}
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">
                  {profileUser.full_name}
                </h1>
                
                {profileUser.location && (
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5" />
                    <span className="text-lg">{profileUser.location}</span>
                  </div>
                )}
                
                {profileUser.rating > 0 && (
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-300 fill-current" />
                    <span className="text-lg font-semibold">{profileUser.rating.toFixed(1)}</span>
                    <span className="opacity-90">({profileUser.total_reviews} reseñas)</span>
                  </div>
                )}
              </div>

              {isOwnProfile && (
                <Link to="/post">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Producto
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-green-100 p-6 text-center shadow-sm">
            <Package className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <p className="text-2xl font-bold text-gray-900 mb-1">{stats.available}</p>
            <p className="text-gray-600">Productos Disponibles</p>
          </div>
          
          <div className="bg-white rounded-xl border border-green-100 p-6 text-center shadow-sm">
            <ShoppingBag className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <p className="text-2xl font-bold text-gray-900 mb-1">{stats.sold}</p>
            <p className="text-gray-600">Productos Vendidos</p>
          </div>

          <div className="bg-white rounded-xl border border-green-100 p-6 text-center shadow-sm">
            <ShoppingCart className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
            <p className="text-2xl font-bold text-gray-900 mb-1">{stats.purchased}</p>
            <p className="text-gray-600">Compras Realizadas</p>
          </div>
          
          <div className="bg-white rounded-xl border border-green-100 p-6 text-center shadow-sm">
            <Star className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
            <p className="text-2xl font-bold text-gray-900 mb-1">{profileUser.total_reviews}</p>
            <p className="text-gray-600">Reseñas Recibidas</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* My Products Card */}
          <div className="bg-white rounded-xl border border-green-100 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Mis Productos ({myProducts.length})
                </h2>
                {isOwnProfile && (
                  <Link to="/my-products">
                    <Button size="sm" variant="outline">
                      Ver Todos
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            
            {loadingProducts ? (
              <div className="p-8">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ) : myProducts.length > 0 ? (
              <div className="p-6">
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {myProducts.slice(0, 3).map((product) => (
                    <Link 
                      key={product.id} 
                      to={`/product/${product.id}`}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                    >
                      <img
                        src={product.images?.[0] || '/placeholder-product.png'}
                        alt={product.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {product.title}
                        </h3>
                        <p className="text-sm text-gray-500 capitalize">
                          {product.category} · {product.condition}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          ₡{product.price.toLocaleString()}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          product.status === 'available' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {product.status === 'available' ? 'Disponible' : 'Vendido'}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
                
                {myProducts.length > 3 && (
                  <div className="mt-6 text-center">
                    <Link to="/my-products">
                      <Button variant="outline" className="w-full">
                        Ver todos los productos ({myProducts.length})
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No tienes productos publicados
                </h3>
                <p className="text-gray-600 mb-6">
                  Comienza a vender tu ropa de segunda mano y contribuye a la moda sostenible
                </p>
                {isOwnProfile && (
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

          {/* Purchases Card */}
          <div className="bg-white rounded-xl border border-green-100 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Compras Recientes ({stats.purchased})
              </h2>
              {isOwnProfile && stats.purchased > 0 && (
                <Link to="/my-products?filter=purchased">
                  <Button size="sm" variant="outline">
                    Ver historial
                  </Button>
                </Link>
              )}
            </div>

            {loadingPurchases ? (
              <div className="p-8">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ) : purchases.length > 0 ? (
              <div className="p-6">
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {purchases.slice(0, 3).map((purchase) => {
                    const product = purchase.product || {};
                    const seller = purchase.seller || {};
                    const mainImage = Array.isArray(product.images) && product.images.length > 0
                      ? product.images[0]
                      : getPlaceholderImage(160, 160);
                    const productLink = product.id ? `/product/${product.id}` : '/browse';

                    return (
                      <div key={purchase.id} className="border border-gray-100 rounded-lg p-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                          <img
                            src={mainImage}
                            alt={product.title || 'Producto'}
                            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg flex-shrink-0"
                          />

                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {product.title || 'Producto sin título'}
                            </h3>
                            {seller.full_name && (
                              <p className="text-sm text-gray-500">
                                Vendedor: {seller.full_name}
                              </p>
                            )}
                            <p className="text-xs text-gray-400">
                              {formatDate(purchase.created_at)}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="font-semibold text-green-600">
                              {formatPrice(product.price || 0)}
                            </p>
                            <span className={`text-xs px-2 py-1 rounded-full ${getPurchaseStatusClasses(purchase.status)}`}>
                              {getPurchaseStatusLabel(purchase.status)}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2 justify-end">
                          <Link to={productLink}>
                            <Button size="sm" variant="outline">
                              Ver producto
                            </Button>
                          </Link>
                          <Link to="/chats" state={{ purchaseId: purchase.id }}>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white gap-2">
                              <MessageCircle className="w-4 h-4" />
                              Ir al chat
                            </Button>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {stats.purchased > purchases.length && (
                  <div className="mt-6 text-center">
                    <Link to="/my-products?filter=purchased">
                      <Button variant="outline" className="w-full">
                        Ver todas las compras ({stats.purchased})
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aún no has comprado productos
                </h3>
                <p className="text-gray-600 mb-6">
                  Explora el catálogo y adquiere prendas únicas para tu guardarropa sostenible.
                </p>
                {isOwnProfile && (
                  <Link to="/browse">
                    <Button className="bg-green-600 hover:bg-green-700">
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Explorar productos
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Reviews Card */}
          <div className="bg-white rounded-xl border border-green-100 overflow-hidden shadow-sm lg:col-span-2">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Reseñas ({profileUser.total_reviews})
              </h2>
            </div>
            
            {loadingReviews ? (
              <div className="p-8">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ) : profileUser.total_reviews > 0 && reviews.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {/* Rating Summary */}
                <div className="p-6 bg-gray-50">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {profileUser.rating.toFixed(1)}
                    </div>
                    <div className="flex items-center justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-5 h-5 ${
                            i < Math.round(profileUser.rating) 
                              ? 'text-yellow-500 fill-current' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">
                      Basado en {profileUser.total_reviews} {profileUser.total_reviews === 1 ? 'reseña' : 'reseñas'}
                    </p>
                  </div>
                </div>

                {/* Reviews List */}
                <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {reviews.map((review) => (
                    <div key={review.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-semibold text-gray-900">
                              {review.reviewer?.full_name || 'Usuario'}
                            </p>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? 'text-yellow-500 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          {review.comment && (
                            <p className="text-sm text-gray-700 mb-2">
                              {review.comment}
                            </p>
                          )}
                          <p className="text-xs text-gray-500">
                            {new Date(review.created_at).toLocaleDateString('es-CR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Sin reseñas aún
                </h3>
                <p className="text-gray-600">
                  Las reseñas aparecerán aquí después de completar transacciones
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Personal Information Card */}
        {isOwnProfile && (
          <div className="bg-white rounded-xl border border-green-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Información Personal
              </h2>
              
              {!isEditing ? (
                <Button onClick={handleStartEdit} variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleSaveEdit} size="sm">
                    <Save className="w-4 h-4 mr-2" />
                    Guardar
                  </Button>
                  <Button onClick={handleCancelEdit} variant="outline" size="sm">
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Tu nombre completo"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{profileUser.full_name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                {isEditing ? (
                  <>
                    <input
                      type="email"
                      value={editData.email}
                      readOnly
                      disabled
                      className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      El correo electrónico no se puede modificar desde esta sección.
                    </p>
                  </>
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{profileUser.email}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Tu número de teléfono"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{profileUser.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Tu ubicación"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{profileUser.location}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Género</label>
                {isEditing ? (
                  <select
                    value={editData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar género</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="otro">Otro</option>
                    <option value="prefiero_no_decir">Prefiero no decir</option>
                  </select>
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md capitalize">{profileUser.gender}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Miembro desde</label>
                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                  {new Date(profileUser.created_at || Date.now()).toLocaleDateString('es-CR')}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
