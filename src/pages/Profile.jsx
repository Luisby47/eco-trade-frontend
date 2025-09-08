import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Package, User, Plus, ShoppingBag, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';

/**
 * Enhanced user profile page matching reference design
 */
const Profile = () => {
  const { id } = useParams();
  const { user, isLoggedIn } = useAuth();
  
  // For MVP, just show current user's profile
  const isOwnProfile = !id || (user && id === user.id);

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

  const profileUser = isOwnProfile ? user : null;

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header Banner */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                {profileUser.profile_picture ? (
                  <img 
                    src={profileUser.profile_picture} 
                    alt={profileUser.full_name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-white" />
                )}
              </div>
              
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {profileUser.full_name}
                </h1>
                <div className="flex items-center gap-2 text-green-100">
                  <MapPin className="w-4 h-4" />
                  <span>{profileUser.location}</span>
                </div>
              </div>
            </div>

            {isOwnProfile && (
              <Link to="/post">
                <Button className="bg-white text-green-600 hover:bg-green-50">
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Producto
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">0</h3>
            <p className="text-gray-600 text-sm">Productos Disponibles</p>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">0</h3>
            <p className="text-gray-600 text-sm">Productos Vendidos</p>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{profileUser.total_reviews}</h3>
            <p className="text-gray-600 text-sm">Reseñas Recibidas</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Products */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Mis Productos (0)</h2>
                {isOwnProfile && (
                  <Link to="/post">
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Publicar Primer Producto
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tienes productos publicados
              </h3>
              <p className="text-gray-600 mb-6">
                Comienza a vender tu ropa de segunda mano y contribuye a la moda sostenible
              </p>
              {isOwnProfile && (
                <Link to="/post">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Publicar Primer Producto
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Reseñas (0)</h2>
            </div>
            <div className="p-8 text-center">
              {profileUser.total_reviews > 0 ? (
                <>
                  <div className="text-4xl font-bold text-green-600 mb-4">
                    {profileUser.rating.toFixed(1)}
                  </div>
                  <div className="flex items-center justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-6 h-6 ${
                          i < Math.round(profileUser.rating) 
                            ? 'text-yellow-500 fill-current' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                  <p className="text-gray-600">
                    Basado en {profileUser.total_reviews} reseñas
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Sin reseñas aún
                  </h3>
                  <p className="text-gray-600">
                    Las reseñas aparecerán aquí después de completar transacciones
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        {isOwnProfile && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Información Personal
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{profileUser.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{profileUser.phone}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Género</label>
                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md capitalize">{profileUser.gender}</p>
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
