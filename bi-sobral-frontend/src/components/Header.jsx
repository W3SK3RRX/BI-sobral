import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth.jsx';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BarChart3, LogOut, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const Header = ({ isTestMode = false }) => {
  const authContext = useAuth();
  const user = isTestMode ? mockUser : authContext?.user;
  const logout = authContext?.logout;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (logout) {
      logout();
      window.location.href = '/login';
    }
  };

  const handleAdminPanel = () => {
    navigate('/admin');
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/90 backdrop-blur-md border-b border-orange-100 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo e título */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-gradient-orange rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition"
            >
              <img
                src="/media/logo.png"
                alt="Logo BI Sobral"
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
              />
              <h1 className="text-xl font-bold text-gradient-orange">PowerBI - Sobral</h1>
            </div>


          </motion.div>

          {/* Menu do usuário */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center space-x-4"
          >
            {/* Nome do usuário (opcional, apenas no desktop) */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.username}
                </p>
              </div>
            </div>

            {/* Dropdown do perfil */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-orange-300 transition focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <Avatar className="h-10 w-10 rounded-full shadow-md border border-orange-300 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                    <AvatarFallback className="text-orange-600 font-semibold text-sm">
                      {getInitials(user?.username || 'U')}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>


              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.username}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* Mostrar botão do painel administrativo se for ADMIN */}
                {user?.access_level === 'ADMIN' && (
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={handleAdminPanel}
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Painel Administrativo</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};
