# 📊 PowerBI Sobral — Sistema de Visualização de Dashboards

Sistema completo para visualização e gerenciamento de dashboards interativos, desenvolvido para uso interno da equipe do **Laboratório Sobral**. Permite o acesso segmentado a relatórios do Power BI, categorização por setor, controle de permissões e interface moderna.

---

## 🚀 Funcionalidades

- 🔐 **Login com autenticação**
- 👤 **Controle de acesso por nível** (ADMIN, GESTOR, USUARIO)
- 🗂️ **Filtragem por categorias**
- 🔍 **Busca inteligente por nome ou descrição**
- 📈 **Cards visuais com contagem e descrição**
- 🖼️ **Abertura em tela cheia (modal fullscreen)**
- 🎨 **Interface elegante com animações**
- 📚 **Integração com banco de dados**
- 🧑‍💻 **Painel de administração para cadastro de dashboards**

---

## 🛠️ Tecnologias utilizadas

| Tecnologia         | Finalidade                           |
|--------------------|---------------------------------------|
| **React + Vite**   | Frontend moderno e rápido             |
| **Tailwind CSS**   | Estilização responsiva e elegante     |
| **Framer Motion**  | Animações suaves                     |
| **React Router**   | Gerenciamento de rotas                |
| **React Query**    | Controle de requisições assíncronas   |
| **Django REST API**| Backend com autenticação e dados      |
| **PostgreSQL**     | Banco de dados com FK para categorias |

---

## 🧭 Navegação

| Rota                     | Acesso     | Descrição                          |
|--------------------------|------------|-------------------------------------|
| `/login`                 | Público    | Tela de autenticação                |
| `/dashboard`             | Protegido  | Visualização e filtro dos dashboards |
| `/admin`                 | Admin only | Cadastro de novos dashboards        |
| `/change-password`       | Protegido  | Troca de senha                      |

---

## 🧪 Como testar localmente

### 1. Clone o projeto

```bash
git clone https://github.com/seu-usuario/powerbi-sobral.git
cd powerbi-sobral
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Inicie o frontend

```bash
npm run dev
```

> ⚠️ Certifique-se de que o backend Django está rodando em paralelo.

---

## 📦 Requisitos do backend

- Python 3.10+
- Django REST Framework
- PostgreSQL
- Endpoints:
  - `GET /api/dashboards/`
  - `GET /api/categories/`
  - `POST /api/dashboard/`
  - Autenticação via JWT

---

## ✅ Status do projeto

🟢 **Funcional e pronto para uso interno**

---

## 📌 Próximos passos sugeridos

- 🔒 Validação de permissões no backend
- ✏️ Edição e exclusão de dashboards
- ✅ Toast de confirmação (cadastro ou erro)
- 📱 Testes completos em mobile
- 🚫 Página de erro 404 / acesso negado
- 🔐 Botão de logout e expiração automática de sessão

---

## 👨‍💼 Responsável técnico

**Empresa:** Laboratório Sobral 
**Desenvolvedor:** [Hian Claudio]
**Desenvolvedor:** [Daniel Barbosa]     
**Contato:** [hian.claudio@laboratoriosobral.com.br]
**Contato:** [daniel.barbosa@laboratoriosobral.com.br]