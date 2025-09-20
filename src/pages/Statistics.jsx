import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { DollarSign, Package, TrendingUp, Crown, AlertCircle, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { es } from 'date-fns/locale';
import { useAuth } from '../contexts/AuthContext';

const COLORS = ['#16a34a', '#22c55e', '#4ade80', '#86efac', '#bbf7d0', '#6ee7b7', '#34d399'];

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

export default function Statistics() {
    const { user } = useAuth();
    const [subscription, setSubscription] = useState(null);
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Datos de ejemplo para demostrar la funcionalidad
    const mockSubscription = {
        id: "sub123",
        user_id: user?.id,
        plan: "premium",
        status: "activa",
        analytics_enabled: true
    };

    const mockStats = {
        totalRevenue: 125000,
        totalItemsSold: 8,
        averageSalePrice: 15625,
        salesByMonth: [
            { name: 'Jun 25', total: 25000 },
            { name: 'Jul 25', total: 35000 },
            { name: 'Ago 25', total: 28000 },
            { name: 'Sep 25', total: 37000 }
        ],
        salesByCategory: [
            { name: 'Camisas', value: 45000 },
            { name: 'Pantalones', value: 35000 },
            { name: 'Vestidos', value: 25000 },
            { name: 'Zapatos', value: 20000 }
        ],
        recentSales: [
            { productName: 'Camisa Vintage de Algodón', price: 12500, date: '18/09/2025' },
            { productName: 'Pantalón de Mezclilla', price: 18000, date: '15/09/2025' },
            { productName: 'Vestido Floral Retro', price: 22000, date: '12/09/2025' },
            { productName: 'Chaqueta de Cuero', price: 35000, date: '08/09/2025' },
            { productName: 'Zapatos Deportivos', price: 15000, date: '05/09/2025' }
        ]
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                if (!user) {
                    setIsLoading(false);
                    return;
                }

                // Simular carga de datos
                setTimeout(() => {
                    // Simular que el usuario tiene una suscripción premium
                    setSubscription(mockSubscription);
                    setStats(mockStats);
                    setIsLoading(false);
                }, 1500);
                
            } catch (error) {
                console.error("Error loading data:", error);
                setIsLoading(false);
            }
        };

        loadData();
    }, [user]);

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="max-w-6xl mx-auto animate-pulse">
                    <div className="h-8 w-1/3 bg-gray-200 rounded mb-12"></div>
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <div className="h-32 bg-gray-200 rounded-2xl"></div>
                        <div className="h-32 bg-gray-200 rounded-2xl"></div>
                        <div className="h-32 bg-gray-200 rounded-2xl"></div>
                    </div>
                    <div className="h-96 bg-gray-200 rounded-2xl"></div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-6">
                <div className="max-w-3xl mx-auto text-center py-16">
                    <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Inicia Sesión
                    </h2>
                    <p className="text-lg text-gray-600 mb-8">
                        Necesitas iniciar sesión para ver tus estadísticas de ventas.
                    </p>
                    <Link to="/login">
                        <Button size="lg" className="bg-green-600 hover:bg-green-700">
                            Iniciar Sesión
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (!subscription || !subscription.analytics_enabled) {
        return (
            <div className="p-6">
                <div className="max-w-3xl mx-auto text-center py-16">
                    <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Acceso Premium Requerido
                    </h2>
                    <p className="text-lg text-gray-600 mb-8">
                        Las estadísticas de ventas son una función exclusiva para nuestros vendedores Premium y Profesionales.
                    </p>
                    <Link to="/subscriptions">
                        <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg">
                            <Crown className="w-5 h-5 mr-2" />
                            Ver Planes Premium
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }
    
    if (!stats) {
        return (
             <div className="p-6">
                <div className="max-w-3xl mx-auto text-center py-16">
                    <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Sin Datos Aún
                    </h2>
                    <p className="text-lg text-gray-600">
                        Parece que aún no tienes ventas completadas. ¡Tus estadísticas aparecerán aquí cuando vendas tu primer artículo!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Estadísticas de Ventas
                    </h1>
                    <p className="text-xl text-gray-600">
                        Analiza el rendimiento de tu tienda y toma mejores decisiones.
                    </p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="border-green-100">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                            <DollarSign className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₡{stats.totalRevenue.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                +12% desde el mes pasado
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-blue-100">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Artículos Vendidos</CardTitle>
                            <Package className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalItemsSold}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                +3 este mes
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-purple-100">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Precio Promedio</CardTitle>
                            <TrendingUp className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₡{stats.averageSalePrice.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                +8% vs promedio anterior
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
                    <Card className="lg:col-span-3 border-gray-200">
                        <CardHeader>
                            <CardTitle>Ventas Mensuales</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={stats.salesByMonth}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis tickFormatter={(value) => `₡${value/1000}k`} />
                                    <Tooltip formatter={(value) => `₡${value.toLocaleString()}`} />
                                    <Legend />
                                    <Bar dataKey="total" fill="#16a34a" name="Ingresos" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card className="lg:col-span-2 border-gray-200">
                        <CardHeader>
                            <CardTitle>Ventas por Categoría</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie 
                                        data={stats.salesByCategory} 
                                        dataKey="value" 
                                        nameKey="name" 
                                        cx="50%" 
                                        cy="50%" 
                                        outerRadius={80} 
                                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {stats.salesByCategory.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `₡${value.toLocaleString()}`} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
                
                {/* Recent Sales Table */}
                <Card className="border-gray-200">
                    <CardHeader>
                        <CardTitle>Ventas Recientes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Producto</TableHead>
                                    <TableHead className="text-right">Precio</TableHead>
                                    <TableHead className="text-right">Fecha</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {stats.recentSales.map((sale, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{sale.productName}</TableCell>
                                        <TableCell className="text-right font-semibold text-green-600">₡{sale.price.toLocaleString()}</TableCell>
                                        <TableCell className="text-right text-gray-600">{sale.date}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Additional Insights */}
                <div className="mt-8">
                    <Card className="border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-green-600" />
                                Insights y Recomendaciones
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">📈 Tendencias</h4>
                                    <ul className="text-sm text-gray-700 space-y-1">
                                        <li>• Las camisas son tu categoría más vendida</li>
                                        <li>• Septiembre ha sido tu mejor mes</li>
                                        <li>• Precio promedio en aumento</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">💡 Recomendaciones</h4>
                                    <ul className="text-sm text-gray-700 space-y-1">
                                        <li>• Publica más camisas y pantalones</li>
                                        <li>• Considera subir precios en zapatos</li>
                                        <li>• Mantén el inventario activo</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}