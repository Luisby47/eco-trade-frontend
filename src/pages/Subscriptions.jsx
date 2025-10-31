import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Star, TrendingUp, Zap, Crown, Target, BarChart3, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { subscriptionsApi } from '../services/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';

export default function Subscriptions() {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    loadUserAndSubscription();
  }, [isLoggedIn, navigate]);

  const loadUserAndSubscription = async () => {
    try {
      const activeSubscription = await subscriptionsApi.getActive();
      
      console.log('🔍 Subscription received from API:', activeSubscription);
      
      // Always set the subscription, even if it's basico (default plan)
      if (activeSubscription) {
        setCurrentSubscription({
          id: activeSubscription.id,
          plan: activeSubscription.plan,
          billing_cycle: activeSubscription.billing_cycle || 'mensual',
          end_date: activeSubscription.end_date,
          status: activeSubscription.status || 'activa'
        });
      } else {
        setCurrentSubscription(null);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading subscription:", error);
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!currentSubscription?.id) {
      alert("No hay suscripción activa para cancelar");
      return;
    }

    const confirmCancel = window.confirm(
      `¿Estás seguro que deseas cancelar tu suscripción ${currentSubscription.plan}? ` +
      `Podrás seguir usando los beneficios hasta ${new Date(currentSubscription.end_date).toLocaleDateString()}`
    );

    if (!confirmCancel) return;

    try {
      await subscriptionsApi.cancel(currentSubscription.id);
      alert("Suscripción cancelada exitosamente. Seguirás teniendo acceso hasta la fecha de vencimiento.");
      loadUserAndSubscription();
    } catch (error) {
      console.error("Error canceling subscription:", error);
      alert(error.response?.data?.message || "Error al cancelar la suscripción. Intenta de nuevo.");
    }
  };

  const handleSubscribe = async (planType, billingCycle) => {
    // Check if user has active subscription (not basico) and needs to cancel first
    if (currentSubscription && 
        currentSubscription.plan !== 'basico' && 
        currentSubscription.status === 'activa' &&
        currentSubscription.id) {
      const confirmChange = window.confirm(
        `Ya tienes una suscripción ${currentSubscription.plan} activa. ` +
        `¿Deseas cancelarla y cambiar a ${planType} ${billingCycle}?`
      );

      if (!confirmChange) return;

      // Cancel current subscription first
      try {
        await subscriptionsApi.cancel(currentSubscription.id);
        // Wait a bit for the cancellation to process
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error("Error canceling current subscription:", error);
        alert("Error al cancelar la suscripción actual. Intenta de nuevo.");
        return;
      }
    }

    const plans = {
      basico: { monthly: 0, annual: 0, featured: 1, products: 10 },
      premium: { monthly: 3500, annual: 35000, featured: 5, products: 50 },
      profesional: { monthly: 6500, annual: 65000, featured: 15, products: 200 }
    };

    const plan = plans[planType];
    const price = billingCycle === "mensual" ? plan.monthly : plan.annual;
    
    const startDate = new Date();
    const endDate = new Date();
    if (billingCycle === "mensual") {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    try {
      const subscriptionData = {
        plan: planType,
        billing_cycle: billingCycle,
        price: Number(price),
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        featured_products_limit: Number(plan.featured),
        products_limit: Number(plan.products),
        analytics_enabled: Boolean(planType !== "basico")
      };

      console.log('Creating subscription with data:', subscriptionData);
      const newSubscription = await subscriptionsApi.create(subscriptionData);

      // Solo mostrar alerta si no es plan básico
      if (planType !== 'basico') {
        setCurrentSubscription({
          id: newSubscription.id,
          plan: newSubscription.plan,
          billing_cycle: newSubscription.billing_cycle,
          end_date: newSubscription.end_date,
          status: newSubscription.status
        });
      }

      alert(`¡Suscripción ${planType} ${billingCycle} activada exitosamente!`);
      
      // Recargar la página para actualizar el estado
      loadUserAndSubscription();
    } catch (error) {
      console.error("Error creating subscription:", error);
      console.error("Error response:", error.response?.data);
      
      // Mostrar mensaje de error más detallado
      const errorMsg = error.response?.data?.message || 
                       (Array.isArray(error.response?.data?.message) 
                         ? error.response.data.message.join(', ') 
                         : "Error al crear la suscripción. Intenta de nuevo.");
      alert(errorMsg);
    }
  };

  const plans = [
    {
      name: "Básico",
      key: "basico",
      icon: Target,
      price: { monthly: 0, annual: 0 },
      description: "Perfecto para empezar a vender",
      features: [
        "Hasta 10 productos publicados",
        "1 producto destacado",
        "Soporte por email",
        "Perfil público básico"
      ],
      popular: false,
      color: "gray"
    },
    {
      name: "Premium",
      key: "premium", 
      icon: Star,
      price: { monthly: 3500, annual: 35000 },
      description: "Ideal para vendedores regulares",
      features: [
        "Hasta 50 productos publicados",
        "5 productos destacados",
        "Estadísticas de ventas",
        "Perfil verificado",
        "Soporte prioritario",

      ],
      popular: true,
      color: "blue"
    },
    {
      name: "Profesional",
      key: "profesional",
      icon: Crown,
      price: { monthly: 6500, annual: 65000 },
      description: "Para vendedores de alta actividad",
      features: [
        "Hasta 200 productos publicados",
        "15 productos destacados",
        "Estadísticas avanzadas",
        "Analytics detallados",
        //"Perfil destacado",
        "Soporte prioritario",
        //"Badge de vendedor profesional",
      ],
      popular: false,
      color: "purple"
    }
  ];

  if (!isLoggedIn) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-8"></div>
          <div className="grid md:grid-cols-3 gap-8">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Planes para Vendedores
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Potencia tus ventas con herramientas profesionales y mayor visibilidad
          </p>

          {currentSubscription && (
            <Alert className={`max-w-2xl mx-auto mb-8 ${
              currentSubscription.plan === 'basico' 
                ? 'border-gray-200 bg-gray-50' 
                : 'border-green-200 bg-green-50'
            }`}>
              <Check className={`h-4 w-4 ${
                currentSubscription.plan === 'basico' 
                  ? 'text-gray-600' 
                  : 'text-green-600'
              }`} />
              <AlertDescription>
                <div className="flex items-center justify-between gap-4">
                  <div className={currentSubscription.plan === 'basico' ? 'text-gray-800' : 'text-green-800'}>
                    <strong>Plan Activo:</strong> {currentSubscription.plan.charAt(0).toUpperCase() + currentSubscription.plan.slice(1)} 
                    {currentSubscription.plan !== 'basico' && (
                      <>
                        ({currentSubscription.billing_cycle}) - 
                        Válido hasta {new Date(currentSubscription.end_date).toLocaleDateString()}
                      </>
                    )}
                    {currentSubscription.status === 'cancelada' && (
                      <span className="ml-2 text-orange-600 font-semibold">(Cancelada)</span>
                    )}
                    {currentSubscription.plan === 'basico' && (
                      <span className="ml-2 text-gray-600">- Plan gratuito</span>
                    )}
                  </div>
                  {currentSubscription.status !== 'cancelada' && 
                   currentSubscription.plan !== 'basico' && 
                   currentSubscription.id && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelSubscription}
                      className="bg-white hover:bg-red-50 text-red-600 border-red-200 hover:border-red-300"
                    >
                      Cancelar Suscripción
                    </Button>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <Card key={plan.key} className={`relative overflow-hidden ${
              plan.popular 
                ? 'border-2 border-blue-500 shadow-2xl transform scale-105' 
                : 'border border-green-200'
            }`}>
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-blue-500 text-white text-center py-2 text-sm font-semibold">
                  Más Popular
                </div>
              )}
              
              <CardHeader className={`text-center ${plan.popular ? 'pt-12' : ''}`}>
                <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 ${
                  plan.color === 'gray' ? 'bg-gray-100' :
                  plan.color === 'blue' ? 'bg-blue-100' : 'bg-purple-100'
                }`}>
                  <plan.icon className={`w-8 h-8 ${
                    plan.color === 'gray' ? 'text-gray-600' :
                    plan.color === 'blue' ? 'text-blue-600' : 'text-purple-600'
                  }`} />
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <p className="text-gray-600">{plan.description}</p>
              </CardHeader>

              <CardContent className="text-center">
                <div className="mb-6">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {plan.price.monthly === 0 ? 'Gratis' : `₡${plan.price.monthly.toLocaleString()}`}
                  </div>
                  {plan.price.monthly > 0 && (
                    <p className="text-gray-600">por mes</p>
                  )}
                </div>

                <ul className="space-y-3 mb-8 text-left">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="space-y-3">
                  <Button
                    onClick={() => handleSubscribe(plan.key, "mensual")}
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                    disabled={currentSubscription?.plan === plan.key}
                  >
                    {currentSubscription?.plan === plan.key ? 'Plan Actual' : 
                     plan.price.monthly === 0 ? 'Comenzar Gratis' : 'Suscribirse Mensual'}
                  </Button>
                  
                  {plan.price.annual > 0 && (
                    <Button
                      variant="outline"
                      onClick={() => handleSubscribe(plan.key, "anual")}
                      className="w-full"
                      disabled={currentSubscription?.plan === plan.key}
                    >
                      Plan Anual - ₡{plan.price.annual.toLocaleString()}
                      <Badge className="ml-2 bg-green-100 text-green-800">
                        Ahorra 15%
                      </Badge>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            ¿Por qué suscribirse a EcoTrade Premium?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Mayor Visibilidad</h3>
              <p className="text-gray-600">
                Tus productos destacados aparecen al inicio de las búsquedas y en la página principal
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Estadísticas Detalladas</h3>
              <p className="text-gray-600">
                Analiza el rendimiento de tus productos, visitas y conversiones
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Herramientas Avanzadas</h3>
              <p className="text-gray-600">
                Acceso a funciones premium que te ayudan a vender más rápido
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}