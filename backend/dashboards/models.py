from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from datetime import timedelta
from django.conf import settings

class User(AbstractUser):
    USER_LEVELS = (
        ('ADMIN', 'Administrador'),
        ('GESTOR', 'Gestor'),
        ('USUARIO', 'Usuário Comum'),
    )

    email = models.EmailField(unique=True)
    access_level = models.CharField(max_length=10, choices=USER_LEVELS, default='USUARIO')
    senha_alterada_em = models.DateTimeField(null=True, blank=True) # <-- ALTERAÇÃO AQUI
    primeiro_acesso = models.BooleanField(default=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def senha_expirada(self):
        """Valida se a senha expirou (apenas para usuários não-admin)."""
        if self.access_level == 'ADMIN' or self.senha_alterada_em is None:
            return False
        return timezone.now() > self.senha_alterada_em + timedelta(days=30)

    def __str__(self):
        return f"{self.username} ({self.email})"


class ActiveSession(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='active_session')
    refresh_token = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Active session for {self.user.email}"


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

    usuarios_permitidos = models.ManyToManyField(User, related_name='dashboards_exclusivos', blank=True)

    def __str__(self):
        return self.nome