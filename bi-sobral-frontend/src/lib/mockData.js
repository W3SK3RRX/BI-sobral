// Mock data para testar os dashboards
export const mockDashboards = [
  {
    id: 1,
    nome: "Dashboard Financeiro",
    descricao: "Análise completa das finanças municipais, incluindo receitas, despesas e indicadores orçamentários.",
    link: "https://app.powerbi.com/view?r=eyJrIjoiZGFzaGJvYXJkLWZpbmFuY2Vpcm8iLCJ0IjoiYWJjZGVmZ2gifQ%3D%3D",
    categoria: { id: 1, name: "Finanças" },
    nivel_minimo: "GESTOR",
    criado_em: "2024-01-15T10:30:00Z",
    criado_por: { username: "admin" }
  },
  {
    id: 2,
    nome: "Indicadores de Saúde",
    descricao: "Monitoramento dos principais indicadores de saúde pública da cidade.",
    link: "https://app.powerbi.com/view?r=eyJrIjoiZGFzaGJvYXJkLXNhdWRlIiwidCI6ImFiY2RlZmdoIn0%3D",
    categoria: { id: 2, name: "Saúde" },
    nivel_minimo: "USUARIO",
    criado_em: "2024-02-10T14:20:00Z",
    criado_por: { username: "gestor_saude" }
  },
  {
    id: 3,
    nome: "Educação Municipal",
    descricao: "Dados educacionais, matrículas, frequência escolar e desempenho dos alunos.",
    link: "https://app.powerbi.com/view?r=eyJrIjoiZGFzaGJvYXJkLWVkdWNhY2FvIiwidCI6ImFiY2RlZmdoIn0%3D",
    categoria: { id: 3, name: "Educação" },
    nivel_minimo: "USUARIO",
    criado_em: "2024-03-05T09:15:00Z",
    criado_por: { username: "gestor_educacao" }
  }
];

export const mockCategories = [
  { id: 1, name: "Finanças" },
  { id: 2, name: "Saúde" },
  { id: 3, name: "Educação" },
  { id: 4, name: "Infraestrutura" },
  { id: 5, name: "Segurança" }
];

export const mockUser = {
  id: 1,
  username: "Admin Teste",
  email: "admin@sobral.gov.br",
  access_level: "ADMIN",
  primeiro_acesso: false
};

