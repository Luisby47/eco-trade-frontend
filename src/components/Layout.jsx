import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import Footer from './Footer';
import { 
  Home, 
  Search, 
  Plus, 
  User, 
  MessageCircle, 
  LogOut,
  Menu,
  X,
  Leaf,
  Settings,
  Star,
  BarChart3
} from 'lucide-react';

/**
 * Utility function for combining class names
 */
const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Modern Layout Component with Collapsible Sidebar
 */
const Layout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const { subscription } = useSubscription();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  // Check if user has analytics access (premium or profesional)
  const hasAnalyticsAccess = subscription?.plan === 'premium' || subscription?.plan === 'profesional';

  const allNavigationItems = [
    { path: '/', icon: Home, label: 'Inicio', active: isActive('/') },
    { path: '/browse', icon: Search, label: 'Explorar', active: isActive('/browse') },
    { path: '/post', icon: Plus, label: 'Publicar', active: isActive('/post') },
    { path: '/subscriptions', icon: Star, label: 'Suscripciones', active: isActive('/subscriptions') },
    { path: '/statistics', icon: BarChart3, label: 'Estadísticas', active: isActive('/statistics'), requiresAnalytics: true },
    { path: '/profile', icon: User, label: 'Perfil', active: isActive('/profile') },
    { path: '/chats', icon: MessageCircle, label: 'Mensajes', active: isActive('/chats') },
  ];

  // Filter navigation items based on subscription
  const navigationItems = allNavigationItems.filter(item => {
    if (item.requiresAnalytics && !hasAnalyticsAccess) {
      return false;
    }
    return true;
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/browse');
    }
  };

  // Don't show layout on login/register pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#F1F5F9' }}>
      {/* Sidebar */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out flex flex-col shadow-sm",
          isCollapsed ? "w-20" : "w-72",
        )}
        style={{ backgroundColor: '#FFFFFF', borderRight: '1px solid #F1F5F9' }}
      >
        {/* Header */}
        <div className="p-4" style={{ borderBottom: '1px solid #F1F5F9' }}>
          <div className="flex items-center justify-between min-h-[40px]">
            {!isCollapsed && (
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#16A34A' }}>
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-lg block truncate" style={{ color: '#111827' }}>EcoTrade</span>
                  <p className="text-xs truncate" style={{ color: '#6B7280' }}>Marketplace Sostenible</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={cn(
                " px-3 py-2 border border-gray-300 rounded-md text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors",
                isCollapsed ? "mx-auto" : "ml-2 flex-shrink-0"
              )}
            
            >
              {isCollapsed ? <Menu className="h-3 w-3" /> : <X className="h-3 w-3" />}
            </button>
          </div>
        </div>

        {/* Search */}
        {!isCollapsed && (
          <div className="p-4" style={{ borderBottom: '1px solid #F1F5F9' }}>
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: '#6B7280' }} />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg text-sm transition-all focus:outline-none"
                style={{
                  backgroundColor: '#F1F5F9',
                  border: '1px solid #F1F5F9',
                  color: '#111827'
                }}
                onFocus={(e) => {
                  e.target.style.backgroundColor = '#FFFFFF';
                  e.target.style.borderColor = '#16A34A';
                  e.target.style.boxShadow = '0 0 0 2px rgba(22, 163, 74, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.backgroundColor = '#F1F5F9';
                  e.target.style.borderColor = '#F1F5F9';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </form>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={cn(
                    "w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    isCollapsed && "justify-center",
                  )}
                  style={item.active ? {
                    backgroundColor: '#ECFDF5',
                    color: '#16A34A',
                    borderLeft: '4px solid #16A34A'
                  } : {
                    color: '#6B7280'
                  }}
                  onMouseEnter={(e) => {
                    if (!item.active) {
                      e.target.style.backgroundColor = '#F1F5F9';
                      e.target.style.color = '#111827';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!item.active) {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#6B7280';
                    }
                  }}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Section */}
        {user && (
          <div className="p-4" style={{ borderTop: '1px solid #F1F5F9' }}>
            <div className={cn(
              "flex items-center space-x-3",
              isCollapsed && "justify-center"
            )}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#16A34A' }}>
                <User className="w-4 h-4 text-white" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: '#111827' }}>{user.name}</p>
                  <p className="text-xs truncate" style={{ color: '#6B7280' }}>{user.email}</p>
                </div>
              )}
            </div>
            
            <div className={cn(
              "mt-3 space-y-1",
              isCollapsed && "flex flex-col items-center space-y-2"
            )}>
              {!isCollapsed ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm rounded-lg"
                  style={{ 
                    color: '#DC2626',
                    backgroundColor: 'transparent'
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </button>
              ) : (
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg"
                  style={{ 
                    color: '#DC2626',
                    backgroundColor: 'transparent'
                  }}
                  title="Cerrar Sesión"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: '#ECFDF5' }}>
        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full flex flex-col">
            <div className="flex-1">
              {children}
            </div>
            <Footer />
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </div>
  );
};

export default Layout;
