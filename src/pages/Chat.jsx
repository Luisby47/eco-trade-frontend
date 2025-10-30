import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, User, Plus, ShoppingBag, Send, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Link } from 'react-router-dom';
import { chatApi } from '../services/api';
import ReviewModal from '../components/ReviewModal';

/**
 * Chat page component matching reference design
 */
const Chat = () => {
  const { isLoggedIn, user } = useAuth();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const messagesEndRef = useRef(null);

  // Cargar chats del usuario
  useEffect(() => {
    const loadChats = async () => {
      if (!isLoggedIn) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const chatsData = await chatApi.getAllChats();
        setChats(chatsData);
      } catch (error) {
        console.error('Error loading chats:', error);
        setChats([]);
      } finally {
        setLoading(false);
      }
    };

    loadChats();
  }, [isLoggedIn]);

  // Cargar mensajes cuando se selecciona un chat
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedChat) return;

      try {
        const messagesData = await chatApi.getMessagesByPurchase(selectedChat.purchase_id);
        setMessages(messagesData);
        // Scroll to bottom
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } catch (error) {
        console.error('Error loading messages:', error);
        setMessages([]);
      }
    };

    loadMessages();
  }, [selectedChat]);

  // Enviar mensaje
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat || sending) return;

    try {
      setSending(true);
      await chatApi.sendMessage({
        purchase_id: selectedChat.purchase_id,
        message: newMessage.trim(),
      });

      // Recargar mensajes
      const messagesData = await chatApi.getMessagesByPurchase(selectedChat.purchase_id);
      setMessages(messagesData);
      setNewMessage('');
      
      // Scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error al enviar el mensaje');
    } finally {
      setSending(false);
    }
  };

  // Seleccionar chat
  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Mis Chats</h1>
          <p className="text-gray-600">
            Coordina pagos y entregas con compradores y vendedores
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
          {/* Conversations List */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-green-600" />
                Conversaciones ({chats.length})
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-4 space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : chats.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No tienes conversaciones activas
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Las conversaciones aparecen cuando compras o vendes productos
                  </p>
                </div>
              ) : (
                <div className="p-2">
                  {chats.map((chat) => (
                    <button
                      key={chat.purchase_id}
                      onClick={() => handleSelectChat(chat)}
                      className={`w-full p-3 rounded-lg mb-2 text-left transition-colors ${
                        selectedChat?.purchase_id === chat.purchase_id
                          ? 'bg-green-50 border border-green-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          {chat.other_user.profile_picture ? (
                            <img 
                              src={chat.other_user.profile_picture} 
                              alt={chat.other_user.full_name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <User className="w-6 h-6 text-green-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">
                            {chat.other_user.full_name}
                          </p>
                          <p className="text-sm text-gray-600 truncate">
                            {chat.product.title}
                          </p>
                          {chat.last_message && (
                            <p className="text-xs text-gray-500 truncate">
                              {chat.last_message.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 flex flex-col">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      {selectedChat.other_user.profile_picture ? (
                        <img 
                          src={selectedChat.other_user.profile_picture} 
                          alt={selectedChat.other_user.full_name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {selectedChat.other_user.full_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedChat.product.title}
                      </p>
                    </div>
                    {/* Review button - only show for buyers */}
                    {selectedChat.purchase.buyer_id === user?.id && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowReviewModal(true)}
                        className="gap-2"
                      >
                        <Star className="w-4 h-4" />
                        Calificar
                      </Button>
                    )}
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => {
                    const isMyMessage = message.sender_id === user?.id;
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            isMyMessage
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <p className={`text-xs mt-1 ${isMyMessage ? 'text-green-100' : 'text-gray-500'}`}>
                            {new Date(message.created_at).toLocaleTimeString('es-CR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Escribe un mensaje..."
                      disabled={sending}
                      className="flex-1"
                    />
                    <Button 
                      type="submit" 
                      disabled={!newMessage.trim() || sending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              </>
            ) : (
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
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {selectedChat && (
        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          purchase={{
            id: selectedChat.purchase_id,
            product_title: selectedChat.product.title,
            seller_id: selectedChat.purchase.seller_id,
            seller_name: selectedChat.other_user.full_name,
          }}
          onReviewSubmitted={() => {
            alert('¡Gracias por tu reseña!');
          }}
        />
      )}
    </div>
  );
};

export default Chat;
