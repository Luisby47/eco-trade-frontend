import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Upload } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';

/**
 * Post product page component - placeholder for MVP
 */
const PostProduct = () => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Inicia sesión para vender
            </h1>
            <p className="text-gray-600 mb-6">
              Necesitas una cuenta para publicar productos en EcoTrade.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/login">
                <Button>
                  Iniciar Sesión
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline">
                  Crear Cuenta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Publicar Producto
        </h1>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <Upload className="w-16 h-16 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Formulario de Producto en Desarrollo
          </h2>
          <p className="text-gray-600 mb-6">
            El formulario para publicar productos estará disponible pronto.
          </p>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Este formulario incluirá:
            </p>
            <ul className="text-left inline-block text-sm text-gray-600 space-y-1">
              <li>• Título y descripción del producto</li>
              <li>• Selección de categoría y condición</li>
              <li>• Precio y talla</li>
              <li>• Ubicación y género target</li>
              <li>• Carga múltiple de imágenes</li>
              <li>• Opción de producto destacado</li>
            </ul>
          </div>
          <div className="mt-8">
            <Link to="/browse">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Explorar Mientras Tanto
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostProduct;
