import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Plus, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';

export default function PostProduct() {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    price: "",
    size: "",
    condition: "",
    location: "",
    gender: ""
  });
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user && user.location) {
      setFormData(prev => ({ ...prev, location: user.location }));
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of files) {
        if (images.length >= 5) {
          setError("Máximo 5 imágenes permitidas");
          break;
        }

        // Por ahora simularemos la carga de imágenes
        const reader = new FileReader();
        reader.onload = (event) => {
          setImages(prev => [...prev, event.target.result]);
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      setError("Error al subir las imágenes");
    }
    setIsUploading(false);
  };

  const removeImage = (indexToRemove) => {
    setImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      setError("Agrega al menos una imagen del producto");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Aquí iría la llamada a la API para crear el producto
      console.log('Creando producto:', {
        ...formData,
        price: parseFloat(formData.price),
        images,
        seller_id: user.id,
        status: "available"
      });

      // Simular éxito
      setSuccess(true);
      setTimeout(() => {
        navigate('/profile');
      }, 2000);

    } catch (error) {
      setError("Error al publicar el producto. Intenta de nuevo.");
    }
    setIsSubmitting(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto text-center py-16">
          <Card className="border-green-100">
            <CardContent className="p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Inicia sesión para vender
              </h1>
              <p className="text-gray-600 mb-6">
                Necesitas una cuenta para publicar productos en EcoTrade.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button onClick={() => navigate('/login')}>
                  Iniciar Sesión
                </Button>
                <Button variant="outline" onClick={() => navigate('/register')}>
                  Crear Cuenta
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto text-center py-16">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ¡Producto Publicado Exitosamente!
          </h2>
          <p className="text-gray-600 mb-6">
            Tu producto ya está disponible para que otros usuarios lo vean y compren.
          </p>
          <Button
            onClick={() => navigate('/profile')}
            className="bg-green-600 hover:bg-green-700"
          >
            Ver Mis Productos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Vender un Producto
          </h1>
          <p className="text-gray-600">
            Publica tu ropa de segunda mano y ayuda a crear un mundo más sostenible
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="border-green-100">
          <CardHeader>
            <CardTitle>Información del Producto</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Images */}
              <div>
                <Label>Imágenes del Producto *</Label>
                <p className="text-sm text-gray-500 mb-4">
                  Agrega hasta 5 imágenes. La primera será la imagen principal.
                </p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={image}
                        alt={`Producto ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 w-6 h-6"
                        onClick={() => removeImage(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                      {index === 0 && (
                        <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                          Principal
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {images.length < 5 && (
                    <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-green-400 hover:bg-green-50 transition-colors">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={isUploading}
                      />
                      {isUploading ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
                      ) : (
                        <>
                          <Plus className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500">Agregar</span>
                        </>
                      )}
                    </label>
                  )}
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <Label htmlFor="title">Título del Producto *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Ej: Camisa blanca de algodón"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Categoría *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)} required>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="camisas">Camisas</SelectItem>
                      <SelectItem value="pantalones">Pantalones</SelectItem>
                      <SelectItem value="vestidos">Vestidos</SelectItem>
                      <SelectItem value="zapatos">Zapatos</SelectItem>
                      <SelectItem value="chaquetas">Chaquetas</SelectItem>
                      <SelectItem value="accesorios">Accesorios</SelectItem>
                      <SelectItem value="deportiva">Ropa Deportiva</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Género *</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)} required>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="femenino">Femenino</SelectItem>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="unisex">Unisex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Talla *</Label>
                  <Select value={formData.size} onValueChange={(value) => handleInputChange("size", value)} required>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="XS">XS</SelectItem>
                      <SelectItem value="S">S</SelectItem>
                      <SelectItem value="M">M</SelectItem>
                      <SelectItem value="L">L</SelectItem>
                      <SelectItem value="XL">XL</SelectItem>
                      <SelectItem value="XXL">XXL</SelectItem>
                      <SelectItem value="28">28</SelectItem>
                      <SelectItem value="30">30</SelectItem>
                      <SelectItem value="32">32</SelectItem>
                      <SelectItem value="34">34</SelectItem>
                      <SelectItem value="36">36</SelectItem>
                      <SelectItem value="38">38</SelectItem>
                      <SelectItem value="40">40</SelectItem>
                      <SelectItem value="42">42</SelectItem>
                      <SelectItem value="Único">Talla Única</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Condición *</Label>
                  <Select value={formData.condition} onValueChange={(value) => handleInputChange("condition", value)} required>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nuevo">Nuevo (con etiquetas)</SelectItem>
                      <SelectItem value="poco_uso">Poco Uso (excelente estado)</SelectItem>
                      <SelectItem value="usado">Usado (buen estado)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="price">Precio (₡) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="1"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="0"
                    required
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descripción *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe tu producto: material, color, estado, marca, etc."
                  className="mt-1 min-h-[120px]"
                  required
                />
              </div>

              <div>
                <Label htmlFor="location">Ubicación *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="Ciudad o provincia en Costa Rica"
                  required
                  className="mt-1"
                />
              </div>

              <div className="pt-6 border-t">
                <Button
                  type="submit"
                  disabled={isSubmitting || images.length === 0}
                  className="w-full bg-green-600 hover:bg-green-700 py-6 text-lg font-semibold"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Publicando...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 mr-2" />
                      Publicar Producto
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
