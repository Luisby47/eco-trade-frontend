import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Twitter, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t mt-auto bg-gray-800" style={{ borderColor: '#475569' }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(to right, #16A34A, #059669)' }}>
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold" style={{ 
                background: 'linear-gradient(to right, #15803D, #059669)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                EcoTrade
              </h2>
            </Link>
            <p style={{ color: '#CBD5E1' }}>
              El mercado de moda sostenible de Costa Rica. Compra, vende y conecta de forma consciente.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#FFFFFF' }}>Navegación</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="transition-colors" style={{ color: '#CBD5E1' }} onMouseEnter={(e) => e.target.style.color = '#16A34A'} onMouseLeave={(e) => e.target.style.color = '#CBD5E1'}>Inicio</Link></li>
              <li><Link to="/browse" className="transition-colors" style={{ color: '#CBD5E1' }} onMouseEnter={(e) => e.target.style.color = '#16A34A'} onMouseLeave={(e) => e.target.style.color = '#CBD5E1'}>Explorar</Link></li>
              <li><Link to="/post" className="transition-colors" style={{ color: '#CBD5E1' }} onMouseEnter={(e) => e.target.style.color = '#16A34A'} onMouseLeave={(e) => e.target.style.color = '#CBD5E1'}>Vender</Link></li>
              <li><Link to="/profile" className="transition-colors" style={{ color: '#CBD5E1' }} onMouseEnter={(e) => e.target.style.color = '#16A34A'} onMouseLeave={(e) => e.target.style.color = '#CBD5E1'}>Mi Perfil</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#FFFFFF' }}>Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="transition-colors" style={{ color: '#CBD5E1' }} onMouseEnter={(e) => e.target.style.color = '#16A34A'} onMouseLeave={(e) => e.target.style.color = '#CBD5E1'}>Términos de Servicio</a></li>
              <li><a href="#" className="transition-colors" style={{ color: '#CBD5E1' }} onMouseEnter={(e) => e.target.style.color = '#16A34A'} onMouseLeave={(e) => e.target.style.color = '#CBD5E1'}>Política de Privacidad</a></li>
              <li><a href="#" className="transition-colors" style={{ color: '#CBD5E1' }} onMouseEnter={(e) => e.target.style.color = '#16A34A'} onMouseLeave={(e) => e.target.style.color = '#CBD5E1'}>Preguntas Frecuentes</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#FFFFFF' }}>Síguenos</h3>
            <div className="flex gap-4">
              <a href="#" className="transition-colors" style={{ color: '#6B7280' }} onMouseEnter={(e) => e.target.style.color = '#16A34A'} onMouseLeave={(e) => e.target.style.color = '#6B7280'}>
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="transition-colors" style={{ color: '#6B7280' }} onMouseEnter={(e) => e.target.style.color = '#16A34A'} onMouseLeave={(e) => e.target.style.color = '#6B7280'}>
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="transition-colors" style={{ color: '#6B7280' }} onMouseEnter={(e) => e.target.style.color = '#16A34A'} onMouseLeave={(e) => e.target.style.color = '#6B7280'}>
                <Facebook className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center" style={{ borderColor: '#F1F5F9', color: '#6B7280' }}>
          <p>&copy; {new Date().getFullYear()} EcoTrade Costa Rica. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}