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
import { Badge } from '@/components/ui/badge';
import { BarChart3, User, Settings, LogOut, Shield, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { mockUser } from '@/lib/mockData';

export const Header = ({ isTestMode = false }) => {
  const authContext = useAuth();
  const user = isTestMode ? mockUser : authContext?.user;
  const logout = authContext?.logout;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    if (logout) {
      logout();
      window.location.href = '/login';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'GESTOR':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'USUARIO':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLevelText = (level) => {
    switch (level) {
      case 'ADMIN': return 'Administrador';
      case 'GESTOR': return 'Gestor';
      case 'USUARIO': return 'Usuário';
      default: return level;
    }
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
            <div>
              <h1 className="text-xl font-bold text-gradient-orange">BI Sobral</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {isTestMode ? 'Modo Teste' : 'Dashboard Inteligente'}
              </p>
            </div>
          </motion.div>

          {/* Menu do usuário */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center space-x-4"
          >
            {/* Informações do usuário (desktop) */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.username}
                </p>
                <div className="flex items-center justify-end space-x-2">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getLevelColor(user?.access_level)}`}
                  >
                    {getLevelText(user?.access_level)}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Dropdown do perfil */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-orange-50">
                  <Avatar className="h-10 w-10 border-2 border-orange-200">
                    <AvatarFallback className="bg-gradient-orange text-white font-semibold">
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
                    <Badge 
                      variant="outline" 
                      className={`text-xs w-fit mt-1 ${getLevelColor(user?.access_level)}`}
                    >
                      {getLevelText(user?.access_level)}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Alterar Senha</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                {!isTestMode && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="cursor-pointer text-red-600 focus:text-red-600"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

