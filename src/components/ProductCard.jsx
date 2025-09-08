import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import { Badge } from './ui/badge';
import { formatPrice, getConditionLabel, getPlaceholderImage } from '../utils';

/**
 * Enhanced product card component matching reference design
 */
const ProductCard = ({ product }) => {
  const mainImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : getPlaceholderImage(400, 600);

  return (
    <Link to={`/product/${product.id}`} className="block">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={mainImage}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = getPlaceholderImage(400, 600);
            }}
          />
          
          {/* Featured Badge */}
          {product.featured && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-amber-100 text-amber-800 border-amber-200 border font-medium shadow-sm text-xs px-2 py-1">
                <Star className="w-3 h-3 mr-1 fill-current" />
                Destacado
              </Badge>
            </div>
          )}

          {/* Price Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4">
            <div className="text-white">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold tracking-tight">{formatPrice(product.price)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-90">Talla {product.size}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 text-gray-900 line-clamp-2 group-hover:text-green-600 transition-colors leading-tight">
            {product.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-500 text-sm">
              <MapPin className="w-4 h-4 mr-1 text-green-600" />
              <span>{product.location}</span>
            </div>
            <div className="text-right text-sm">
              <Badge 
                variant="outline" 
                className="text-xs px-2 py-1"
              >
                {getConditionLabel(product.condition)}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
