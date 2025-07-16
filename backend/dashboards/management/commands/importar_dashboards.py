import pandas as pd
from django.core.management.base import BaseCommand
from dashboards.models import Dashboard, Category, User
import os

class Command(BaseCommand):
    help = 'Importa dashboards a partir de uma planilha Excel'

    def handle(self, *args, **options):
        path = os.path.join('scripts', 'Power BI - links.xlsx')  # ajuste se estiver em outro lugar
        df = pd.read_excel(path)

        for _, row in df.iterrows():
            nome = row['Nome do Painel']
            descricao = row.get('Descrição', '')
            link = row['Link']
            categoria = row['Categoria']
            nivel = row['Nivel de acesso']

            # Cria ou recupera a categoria
            categoria, _ = Category.objects.get_or_create(name=categoria)

            dashboard, created = Dashboard.objects.get_or_create(
                nome=nome,
                defaults={
                    'descricao': descricao,
                    'link': link,
                    'categoria': categoria,
                    'nivel_minimo': nivel,
                    'criado_por': None  # ou defina o user default se preferir
                }
            )

            if created:
                print(f"✅ Inserido: {nome}")
            else:
                print(f"ℹ️ Já existia: {nome}")
