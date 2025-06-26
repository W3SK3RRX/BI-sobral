import { Header } from '@/components/Header';
import { DashboardCard } from '@/components/DashboardCard';
import { mockDashboards } from '@/lib/mockData';
import { motion } from 'framer-motion';

export const TestPage = () => {
  return (
    <div className="min-h-screen bg-gradient-orange-light">
      <Header isTestMode={true} />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
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
                <h2 className="text-2xl font-bold text-gradient-orange">Teste dos Cards</h2>
                <p className="text-muted-foreground">
                  Visualização dos cards com iframe de pré-visualização e tela cheia
                </p>
              </div>
            </div>
          </motion.div>

          {/* Grid de dashboards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockDashboards.map((dashboard, index) => (
              <DashboardCard
                key={dashboard.id}
                dashboard={dashboard}
                index={index}
              />
            ))}
          </div>
        </div>
      </motion.main>
    </div>
  );
};

