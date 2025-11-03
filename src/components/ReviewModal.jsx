import React, { useState } from 'react';
import { X, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { reviewsApi } from '../services/api';

/**
 * Modal for creating a review after a purchase
 */
const ReviewModal = ({ isOpen, onClose, purchase, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Por favor selecciona una calificación');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const reviewData = {
        reviewed_user_id: purchase.seller_id,
        purchase_id: purchase.id,
        rating: rating,
        comment: comment.trim() || undefined,
      };

      await reviewsApi.create(reviewData);
      
      // Reset form
      setRating(0);
      setComment('');
      
      // Notify parent and close
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
      onClose();
    } catch (err) {
      console.error('Error al enviar review:', err);
      setError(err.response?.data?.message || 'Error al enviar la reseña');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Calificar Vendedor
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Product Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Producto comprado:</p>
            <p className="font-semibold text-gray-900">{purchase.product_title}</p>
            <p className="text-sm text-gray-600 mt-1">
              Vendedor: {purchase.seller_name}
            </p>
          </div>

          {/* Rating Stars */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Calificación *
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110 border-none bg-transparent p-0 focus:outline-none"
                  style={{ border: 'none', background: 'transparent' }}
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-500 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {rating === 1 && 'Muy malo'}
                {rating === 2 && 'Malo'}
                {rating === 3 && 'Regular'}
                {rating === 4 && 'Bueno'}
                {rating === 5 && 'Excelente'}
              </p>
            )}
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comentario (opcional)
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Cuéntanos sobre tu experiencia con este vendedor..."
              className="min-h-[100px] resize-none"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1 text-right">
              {comment.length}/500
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || rating === 0}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Reseña'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
