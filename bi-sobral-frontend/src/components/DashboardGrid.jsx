import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardAPI } from '@/lib/api';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { FullscreenModal } from './FullscreenModal';

export const DashboardGrid = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const selectedCategory = searchParams.get('categoria') || 'all';
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [modalData, setModalData] = useState(null);

  const { data: dashboards = [], isLoading: dashboardsLoading } = useQuery({
    queryKey: ['dashboards'],
    queryFn: dashboardAPI.getDashboards,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: dashboardAPI.getCategories,
  });

  const filteredDashboards = dashboards.filter((dashboard) => {
    const matchesSearch =
      dashboard.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dashboard.descricao?.toLowerCase().includes(searchTerm.toLowerCase());

    const dashboardCategoryId =
      typeof dashboard.categoria === 'object'
        ? dashboard.categoria.id
        : dashboard.categoria;

    const matchesCategory =
      selectedCategory === 'all' ||
      String(dashboardCategoryId) === selectedCategory;

    const matchesLevel =
      selectedLevel === 'all' ||
      dashboard.nivel_minimo === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  const dashboardsGrouped = categories.map((category) => ({
    ...category,
    dashboards: filteredDashboards.filter((d) => {
      const dashboardCategoryId =
        typeof d.categoria === 'object' ? d.categoria.id : d.categoria;
      return String(dashboardCategoryId) === String(category.id);
    }),
  }));

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-orange border-0"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gradient-orange">
              Dashboards Disponíveis
            </h2>
            <p className="text-muted-foreground">
              Acesse os painéis de controle e relatórios do sistema
            </p>
          </div>
          <Badge
            variant="outline"
            className="bg-primary/10 text-primary border-primary/20"
          >
            <BarChart3 className="w-3 h-3 mr-1" />
            {filteredDashboards.length} dashboard
            {filteredDashboards.length !== 1 ? 's' : ''}
          </Badge>
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

          <Select
            value={selectedCategory}
            onValueChange={(value) => {
              const newParams = new URLSearchParams(searchParams);
              if (value === 'all') {
                newParams.delete('categoria');
              } else {
                newParams.set('categoria', value);
              }
              setSearchParams(newParams);
            }}
          >
            <SelectTrigger className="w-full sm:w-48 border-gradient-orange">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Conteúdo */}
      {dashboardsLoading ? (
        <div className="flex items-center justify-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
          />
        </div>
      ) : filteredDashboards.length === 0 ? (
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
        <Accordion type="multiple" className="space-y-2">
          {dashboardsGrouped.map((group) =>
            group.dashboards.length > 0 ? (
              <AccordionItem key={group.id} value={group.name}>
                <AccordionTrigger className="text-lg font-medium">
                  {group.name}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {group.dashboards.map((dashboard) => (
                      <div
                        key={dashboard.id}
                        className="flex justify-between items-start bg-white/70 p-4 rounded-lg border border-muted shadow-sm hover:shadow-md transition"
                      >
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {dashboard.nome}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {dashboard.descricao}
                          </p>
                          <p className="text-xs mt-1 text-muted-foreground">
                            Nível: {dashboard.nivel_minimo}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => setModalData(dashboard)}
                        >
                          Abrir
                        </Button>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ) : null
          )}
        </Accordion>
      )}

      {/* Modal */}
      {modalData && (
        <FullscreenModal
          isOpen={!!modalData}
          onClose={() => setModalData(null)}
          dashboardUrl={modalData.link}
          dashboardName={modalData.nome}
        />
      )}
    </div>
  );
};
