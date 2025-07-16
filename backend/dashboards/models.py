from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from datetime import timedelta

class User(AbstractUser):
    USER_LEVELS = (
        ('ADMIN', 'Administrador'),
        ('GESTOR', 'Gestor'),
        ('USUARIO', 'Usuário Comum'),
    )
    email = models.EmailField(unique=True)
    access_level = models.CharField(max_length=10, choices=USER_LEVELS, default='USUARIO')
    senha_alterada_em = models.DateTimeField(auto_now_add=True)

    primeiro_acesso = models.BooleanField(default=True)  # 👈 NOVO

    def senha_expirada(self):
        if self.access_level == 'ADMIN':
            return False
        return timezone.now() > self.senha_alterada_em + timedelta(days=30)


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name

class Dashboard(models.Model):
    nivel_minimo_choices = (
        ('ADMIN', 'Administrador'),
        ('GESTOR', 'Gestor'),
        ('USUARIO', 'Usuário Comum'),
    )
    nome = models.CharField(max_length=255)
    descricao = models.TextField(blank=True, null=True)
    link = models.URLField()
    categoria = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    nivel_minimo = models.CharField(max_length=10, choices=nivel_minimo_choices, default='USUARIO')
    criado_por = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_dashboards')
    criado_em = models.DateTimeField(auto_now_add=True)

    # Novo campo: usuários específicos que podem visualizar
    usuarios_permitidos = models.ManyToManyField(User, related_name='dashboards_exclusivos', blank=True)

    def __str__(self):
        return self.nome


