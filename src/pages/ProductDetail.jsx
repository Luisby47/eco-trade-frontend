import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, ChevronLeft, ChevronRight, MessageCircle, ShoppingBag, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';

import QASection from '../components/products/QASection';
import PurchaseModal from '../components/products/PurchaseModal';

const conditionLabels = {
  nuevo: "Nuevo",
  poco_uso: "Poco Uso",
  usado: "Usado"
};

const categoryLabels = {
  camisas: "Camisas",
  pantalones: "Pantalones",
  vestidos: "Vestidos",
  zapatos: "Zapatos",
  chaquetas: "Chaquetas",
  accesorios: "Accesorios",
  deportiva: "Deportiva",
  otro: "Otro"
};

export default function ProductDetail() {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Datos de ejemplo para mostrar la funcionalidad
  const mockProduct = {
    id: productId,
    title: "Camisa Vintage de Algodón",
    price: 12500,
    description: "Hermosa camisa vintage de algodón 100% en excelente estado. Perfecta para looks casuales o formales. Ha sido cuidada con mucho amor y apenas tiene signos de uso.\n\nDetalles:\n• Material: Algodón 100%\n• Color: Azul claro\n• Marca: No brand\n• Origen: Costa Rica\n\nIdeal para personas que buscan piezas únicas y sostenibles.",
    category: "camisas",
    condition: "poco_uso",
    size: "M",
    location: "San José, Costa Rica",
    status: "available",
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop"
    ],
    seller_id: "seller123"
  };

  const mockSeller = {
    id: "seller123",
    full_name: "María González",
    location: "San José",
    rating: 4.8,
    total_reviews: 23,
    profile_picture: null
  };

  const mockQuestions = [
    {
      id: "q1",
      question: "¿Está en buen estado? ¿Tiene algún detalle?",
      user_name: "Carlos Ruiz",
      created_date: "2025-09-19",
      answers: [
        {
          id: "a1",
          answer: "¡Hola! Sí, está en excelente estado. Solo tiene un pequeño desvanecimiento natural del color por el uso, pero nada notable. La he cuidado muy bien.",
          created_date: "2025-09-19"
        }
      ]
    },
    {
      id: "q2",
      question: "¿Hacés envíos a Cartago?",
      user_name: "Ana Jiménez",
      created_date: "2025-09-18",
      answers: []
    }
  ];

  const loadProductData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Simular carga de datos
      setTimeout(() => {
        setProduct(mockProduct);
        setSeller(mockSeller);
        setQuestions(mockQuestions);
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      setError("Error al cargar el producto");
      console.error("Error loading product data:", error);
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (!productId) {
      navigate('/browse');
      return;
    }
    loadProductData();
  }, [productId, navigate, loadProductData]);

  const handlePurchase = async (purchaseData) => {
    try {
      // Simular creación de compra
      console.log('Creando compra:', {
        product_id: productId,
        buyer_id: user.id,
        seller_id: product.seller_id,
        buyer_name: purchaseData.name,
        buyer_email: purchaseData.email,
        buyer_phone: purchaseData.phone,
        status: "pending"
      });

      // Simular éxito
      setShowPurchaseModal(false);
      alert('¡Compra iniciada! Se ha creado un chat con el vendedor.');
      navigate('/chats');
    } catch (error) {
      setError("Error al procesar la compra. Intenta de nuevo.");
      console.error("Error processing purchase:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto animate-pulse">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-gray-200 rounded-2xl"></div>
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto text-center py-16">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            {error || "Producto no encontrado"}
          </h3>
          <Button
            onClick={() => navigate('/browse')}
            className="bg-green-600 hover:bg-green-700"
          >
            Volver a Explorar
          </Button>
        </div>
      </div>
    );
  }

  const images = product.images || [];
  const currentImage = images[currentImageIndex] || "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop";

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-6 border-green-200 hover:bg-green-50"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
              <img
                src={currentImage}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              
              {images.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm border-white/50 hover:bg-white/90"
                    onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm border-white/50 hover:bg-white/90"
                    onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex ? 'border-green-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                    {product.title}
                  </h1>
                  <p className="text-2xl lg:text-3xl font-bold text-green-600">
                    ₡{product.price?.toLocaleString()}
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200 text-sm px-3 py-1">
                  {conditionLabels[product.condition]}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                <Badge variant="outline" className="px-3 py-1">
                  {categoryLabels[product.category]}
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  Talla {product.size}
                </Badge>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{product.location}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {product.description}
              </p>
            </div>

            {/* Seller Info */}
            {seller && (
              <Card className="border-green-100">
                <CardHeader>
                  <CardTitle className="text-lg">Vendedor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      {seller.profile_picture ? (
                        <img src={seller.profile_picture} alt={seller.full_name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-green-600 font-semibold">
                          {seller.full_name?.[0]?.toUpperCase() || '?'}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{seller.full_name}</p>
                      <p className="text-sm text-gray-600">{seller.location}</p>
                      {seller.rating > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{seller.rating.toFixed(1)}</span>
                          <span className="text-sm text-gray-500">({seller.total_reviews} reseñas)</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Purchase Button */}
            {product.status === "available" ? (
              <div className="space-y-4">
                {!user ? (
                  <div className="space-y-3">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Inicia sesión para comprar este producto
                      </AlertDescription>
                    </Alert>
                    <Button
                      onClick={() => navigate('/login')}
                      className="w-full bg-green-600 hover:bg-green-700 py-6 text-lg font-semibold rounded-xl"
                    >
                      Iniciar Sesión para Comprar
                    </Button>
                  </div>
                ) : user.id === product.seller_id ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Este es tu propio producto
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Button
                    onClick={() => setShowPurchaseModal(true)}
                    className="w-full bg-green-600 hover:bg-green-700 py-6 text-lg font-semibold rounded-xl shadow-lg"
                  >
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Comprar Ahora
                  </Button>
                )}
              </div>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Este producto ya no está disponible
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        {/* Q&A Section */}
        <div className="mt-16">
          <QASection
            productId={productId}
            questions={questions}
            user={user}
            onQuestionAdded={loadProductData}
            sellerId={product.seller_id}
          />
        </div>

        {/* Purchase Modal */}
        {showPurchaseModal && (
          <PurchaseModal
            product={product}
            onClose={() => setShowPurchaseModal(false)}
            onSubmit={handlePurchase}
          />
        )}
      </div>
    </div>
  );
}
