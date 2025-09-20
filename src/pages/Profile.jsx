import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Package, User, Plus, ShoppingBag, MessageCircle, Edit, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';

/**
 * Enhanced user profile page matching reference design
 */
const Profile = () => {
  const { id } = useParams();
  const { user, isLoggedIn } = useAuth();
  
  // Estados para edición
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  
  // For MVP, just show current user's profile
  const isOwnProfile = !id || (user && id === user.id);

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
      // Aquí iría la llamada a la API para actualizar el usuario
      console.log('Guardando datos:', editData);
      
      // Por ahora solo simulamos el guardado
      alert('Información actualizada correctamente');
      setIsEditing(false);
      
      // En una implementación real, actualizarías el contexto del usuario aquí
      // await updateUser(editData);
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar la información');
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
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl border border-green-100 overflow-hidden mb-8 shadow-sm">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
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
                  <Button className="bg-white text-green-600 hover:bg-gray-50">
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Producto
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-green-100 p-6 text-center shadow-sm">
            <Package className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <p className="text-2xl font-bold text-gray-900 mb-1">0</p>
            <p className="text-gray-600">Productos Disponibles</p>
          </div>
          
          <div className="bg-white rounded-xl border border-green-100 p-6 text-center shadow-sm">
            <ShoppingBag className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <p className="text-2xl font-bold text-gray-900 mb-1">0</p>
            <p className="text-gray-600">Productos Vendidos</p>
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
                <h2 className="text-lg font-semibold text-gray-900">Mis Productos (0)</h2>
                {isOwnProfile && (
                  <Link to="/post">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Publicar
                    </Button>
                  </Link>
                )}
              </div>
            </div>
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
          </div>

          {/* Reviews Card */}
          <div className="bg-white rounded-xl border border-green-100 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100">
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
                  <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
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
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Tu email"
                  />
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
