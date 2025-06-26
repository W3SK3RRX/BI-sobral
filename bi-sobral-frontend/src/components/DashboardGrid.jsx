import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardAPI } from '@/lib/api';
import { DashboardCard } from './DashboardCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Grid3X3, List, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DashboardGrid = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const { data: dashboards = [], isLoading: dashboardsLoading } = useQuery({
    queryKey: ['dashboards'],
    queryFn: dashboardAPI.getDashboards,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: dashboardAPI.getCategories,
  });

  const filteredDashboards = dashboards.filter(dashboard => {
    const matchesSearch = dashboard.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dashboard.descricao?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
                           dashboard.categoria?.id.toString() === selectedCategory;
    
    const matchesLevel = selectedLevel === 'all' || 
                        dashboard.nivel_minimo === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  const getLevelText = (level) => {
    switch (level) {
      case 'ADMIN': return 'Administrador';
      case 'GESTOR': return 'Gestor';
      case 'USUARIO': return 'Usuário';
      default: return level;
    }
  };

  if (dashboardsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho com estatísticas */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-orange border-0"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gradient-orange">Dashboards Disponíveis</h2>
            <p className="text-muted-foreground">
              Acesse os painéis de controle e relatórios do sistema
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              <BarChart3 className="w-3 h-3 mr-1" />
              {filteredDashboards.length} dashboard{filteredDashboards.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar dashboards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gradient-orange focus:ring-primary"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48 border-gradient-orange">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger className="w-full sm:w-48 border-gradient-orange">
              <SelectValue placeholder="Nível de acesso" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os níveis</SelectItem>
              <SelectItem value="USUARIO">Usuário</SelectItem>
              <SelectItem value="GESTOR">Gestor</SelectItem>
              <SelectItem value="ADMIN">Administrador</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Grid de dashboards */}
      <AnimatePresence mode="wait">
        {filteredDashboards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              Nenhum dashboard encontrado
            </h3>
            <p className="text-sm text-muted-foreground">
              Tente ajustar os filtros ou entre em contato com o administrador
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredDashboards.map((dashboard, index) => (
              <DashboardCard
                key={dashboard.id}
                dashboard={dashboard}
                index={index}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

