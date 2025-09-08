import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { Button } from '../components/ui/button';

/**
 * Product detail page component - placeholder for MVP
 */
const ProductDetail = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-6">
        <Link to="/browse" className="inline-flex items-center text-green-600 hover:text-green-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a explorar
        </Link>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Página de Producto en Desarrollo
          </h1>
          <p className="text-gray-600 mb-6">
            La página de detalle del producto (ID: {id}) estará disponible pronto.
          </p>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Esta página incluirá:
            </p>
            <ul className="text-left inline-block text-sm text-gray-600 space-y-1">
              <li>• Galería de fotos del producto</li>
              <li>• Información detallada del vendedor</li>
              <li>• Sección de preguntas y respuestas públicas</li>
              <li>• Botón de compra con modal de confirmación</li>
              <li>• Sistema de reseñas</li>
            </ul>
          </div>
          <div className="mt-8">
            <Link to="/browse">
              <Button>
                Seguir Explorando
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
