import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { FullscreenModal } from './FullscreenModal';

export const DashboardCard = ({ dashboard, index }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleOpenDashboard = () => {
    setIsFullscreen(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
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
      case 'ADMIN':
        return 'Administrador';
      case 'GESTOR':
        return 'Gestor';
      case 'USUARIO':
        return 'Usuário';
      default:
        return level;
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ y: -4 }}
        className="h-full"
      >
        <Card className="h-full hover-lift shadow-orange border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-orange rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-1">
                    {dashboard.nome}
                  </CardTitle>
                  {dashboard.categoria && (
                    <CardDescription className="text-sm text-muted-foreground">
                      {dashboard.categoria.name}
                    </CardDescription>
                  )}
                </div>
              </div>
              <Badge 
                variant="outline" 
                className={`text-xs ${getLevelColor(dashboard.nivel_minimo)}`}
              >
                {getLevelText(dashboard.nivel_minimo)}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0 space-y-4">
            {dashboard.descricao && (
              <p className="text-sm text-muted-foreground line-clamp-3">
                {dashboard.descricao}
              </p>
            )}

            <div className="flex gap-2">
              <Button
                onClick={handleOpenDashboard}
                className="flex-1 border-orange-200 "
                size="sm"
              >
                <Maximize2 className="w-4 h-4 mr-2" />
                Abrir Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <FullscreenModal
        isOpen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
        dashboardUrl={dashboard.link}
        dashboardName={dashboard.nome}
      />
    </>
  );
};
