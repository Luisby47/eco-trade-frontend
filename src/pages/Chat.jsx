import React from 'react';
import { MessageCircle, User, Plus, ShoppingBag } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

/**
 * Chat page component matching reference design
 */
const Chat = () => {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Inicia sesión para ver tus chats
          </h2>
          <p className="text-gray-600 mb-6">
            Necesitas estar autenticado para acceder a tus conversaciones.
          </p>
          <Link to="/login">
            <Button>Iniciar Sesión</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Mis Chats</h1>
          <p className="text-gray-600">
            Coordina pagos y entregas con compradores y vendedores
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
          {/* Conversations List */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-green-600" />
                Conversaciones (0)
              </h2>
            </div>
            
            <div className="p-8 text-center">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tienes conversaciones activas
              </h3>
              <p className="text-gray-600 text-sm">
                Las conversaciones aparecen cuando compras o vendes productos
              </p>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 flex flex-col">
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Selecciona una conversación para comenzar
                </h3>
                <p className="text-gray-600 mb-8">
                  Cuando compres o vendas productos, podrás chatear aquí para coordinar la entrega
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/browse">
                    <Button variant="outline">
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Explorar Productos
                    </Button>
                  </Link>
                  <Link to="/post">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Vender Producto
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
