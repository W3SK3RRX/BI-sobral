# Sistema de Visualização de Dashboards Power BI com Controle de Acesso

Este projeto consiste em um sistema web para visualização de dashboards Power BI com controle de acesso robusto, níveis de permissão e medidas de segurança para proteger informações sensíveis.

## Estrutura do Projeto

O projeto é dividido em duas partes principais:

- **Backend**: Desenvolvido com Django e Django REST Framework.
- **Frontend**: Desenvolvido com React.js.

## Requisitos

Para rodar este projeto, você precisará ter instalado:

- Python 3.x
- Node.js e pnpm
- PostgreSQL (ou configurar outro banco de dados no Django)

## Configuração e Execução

### 1. Backend (Django)

1.  **Navegue até o diretório do backend:**
    ```bash
    cd dashboard_project
    ```

2.  **Instale as dependências do Python:**
    ```bash
    pip install -r requirements.txt
    ```
    (Você precisará criar um `requirements.txt` com as dependências: `Django`, `djangorestframework`, `djangorestframework-simplejwt`, `psycopg2-binary`)

3.  **Configure o banco de dados PostgreSQL:**
    Certifique-se de que o PostgreSQL esteja rodando e crie um banco de dados e um usuário conforme configurado em `dashboard_project/settings.py`.
    Exemplo de comandos (como usuário `postgres`):
    ```bash
    sudo -u postgres psql -c "CREATE DATABASE dashboard_db;"
    sudo -u postgres psql -c "CREATE USER dashboard_user WITH PASSWORD 'password';"
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE dashboard_db TO dashboard_user;"
    ```

4.  **Aplique as migrações do banco de dados:**
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```

5.  **Crie um superusuário (para acessar o painel de administração do Django):**
    ```bash
    python manage.py createsuperuser
    ```
    Siga as instruções para criar o usuário.

6.  **Inicie o servidor backend:**
    ```bash
    python manage.py runserver 0.0.0.0:8000
    ```
    O servidor estará disponível em `http://localhost:8000` (ou no endereço exposto pelo Manus).

### 2. Frontend (React)

1.  **Navegue até o diretório do frontend:**
    ```bash
    cd frontend
    ```

2.  **Instale as dependências do Node.js:**
    ```bash
    pnpm install
    ```

3.  **Inicie o servidor de desenvolvimento do frontend:**
    ```bash
    pnpm run dev --host
    ```
    O frontend estará disponível em `http://localhost:5173` (ou no endereço exposto pelo Manus).

## Funcionalidades Implementadas

- **Autenticação JWT**: Login e logout com tokens de acesso e refresh.
- **Controle de Acesso**: Dashboards visíveis de acordo com o nível de permissão do usuário (ADMIN, GESTOR, USUARIO).
- **Gerenciamento de Usuários e Dashboards**: CRUD completo para administradores.
- **Visualização de Dashboards**: Exibição de dashboards Power BI via iframe.
- **Segurança Frontend (JavaScript)**:
    - Desabilita clique direito.
    - Bloqueia teclas como PrintScreen, Ctrl+P, Ctrl+S, Ctrl+U.
    - Marca d'água dinâmica com nome do usuário e horário.
    - Tentativa de bloqueio parcial de DevTools.

## Próximos Passos (Melhorias Futuras)

- Integração com Power BI Embedded e Azure AD.
- Logs detalhados de acesso e auditoria.
- Dashboard personalizado por usuário com RLS (Row-Level Security).
- Notificações de acesso e tentativas bloqueadas.
- Tema escuro/claro para acessibilidade.



