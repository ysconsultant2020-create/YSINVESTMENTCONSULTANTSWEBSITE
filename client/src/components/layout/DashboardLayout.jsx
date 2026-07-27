import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Shield, TrendingUp, Wallet, PieChart, Users, Calendar,
  MessageSquare, ChevronLeft, ChevronRight, LogOut, Home, Menu, X
} from 'lucide-react';
import Logo from '../ui/Logo';

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/manager' },
    { name: 'Insurance', icon: Shield, path: '/manager/insurance' },
    { name: 'Mutual Funds', icon: TrendingUp, path: '/manager/mutual-funds' },
    { name: 'SIP Plans', icon: Wallet, path: '/manager/sip-plans' },
    { name: 'Lumpsum Plans', icon: PieChart, path: '/manager/lumpsum-plans' },
    { name: 'Customers', icon: Users, path: '/manager/customers' },
    { name: 'Appointments', icon: Calendar, path: '/manager/appointments' },
    { name: 'Messages', icon: MessageSquare, path: '/manager/messages' },
  ];

  const isActive = (path) => {
    if (path === '/manager') return location.pathname === '/manager';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const Sidebar = ({ isMobile = false }) => (
    <div className={`flex flex-col h-full bg-navy-900 border-r border-white/5 ${
      isMobile ? 'w-72' : collapsed ? 'w-20' : 'w-64'
    } transition-all duration-300`}>
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/5">
        {(!collapsed || isMobile) && (
          <Link to="/" className="flex items-center gap-2">
            <Logo size="sm" />
          </Link>
        )}
        {collapsed && !isMobile && (
          <Link to="/" className="mx-auto">
            <Logo size="sm" showText={false} />
          </Link>
        )}
        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
        {isMobile && (
          <button onClick={() => setMobileOpen(false)} className="p-1.5 text-white/40 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => isMobile && setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive(item.path)
                ? 'bg-gold-400/10 text-gold-400 border border-gold-400/20 shadow-md'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {(!collapsed || isMobile) && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/5 space-y-1">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all"
        >
          <Home className="w-5 h-5 shrink-0" />
          {(!collapsed || isMobile) && <span>Back to Site</span>}
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400/60 hover:text-red-400 hover:bg-red-400/10 transition-all w-full"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {(!collapsed || isMobile) && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-navy-950 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative h-full">
            <Sidebar isMobile />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-navy-900/50 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-white/60 hover:bg-white/5 transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-white">
              {menuItems.find((item) => isActive(item.path))?.name || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gold-400/20 border border-gold-400/30 flex items-center justify-center">
              <span className="text-gold-400 text-sm font-bold">M</span>
            </div>
            <span className="hidden sm:block text-sm text-white/60">{user?.name || 'Manager'}</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
