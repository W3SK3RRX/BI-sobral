import pandas as pd
from dashboards.models import Dashboard  # Substitua pelo nome correto do app
from django.utils.text import slugify

# Carregar Excel
df = pd.read_excel("links.xlsx")

# Mapear níveis de acesso para o campo 'nivel_minimo'
nivel_map = {
    'Administrador': 'ADMIN',
    'Gestor': 'GESTOR',
    'Usuário Comum': 'USUARIO',
    'Usuário': 'USUARIO'
}

# Loop de inserção
for _, row in df.iterrows():
    nome = row['Nome do Painel']
    descricao = nome
    link = row['Link']
    categoria = row['setor']
    nivel = nivel_map.get(str(row['Nivel de acesso']).strip(), 'USUARIO')

    dashboard, created = Dashboard.objects.get_or_create(
        nome=nome,
        defaults={
            'descricao': descricao,
            'link': link,
            'categoria': categoria,
            'nivel_minimo': nivel
        }
    )

    if created:
        print(f"✅ Inserido: {nome}")
    else:
        print(f"⚠️ Já existia: {nome}")
