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
    senha_alterada_em = models.DateTimeField(null=True, blank=True)
    primeiro_acesso = models.BooleanField(default=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    # >>>>>>>>>>>>>>> ADIÇÕES IMPORTANTES <<<<<<<<<<<<<<<
    def set_password(self, raw_password):
        super().set_password(raw_password)
        # toda troca de senha atualiza o timestamp
        self.senha_alterada_em = timezone.now()

    def set_unusable_password(self):
        super().set_unusable_password()
        # se por algum motivo definirem senha inutilizável, também atualiza
        self.senha_alterada_em = timezone.now()

    def save(self, *args, **kwargs):
        # garante valor na criação via admin/shell (sem passar pelo serializer)
        if self._state.adding and not self.senha_alterada_em:
            self.senha_alterada_em = timezone.now()
        super().save(*args, **kwargs)
    # >>>>>>>>>>>>>>> FIM DAS ADIÇÕES <<<<<<<<<<<<<<<

    def senha_expirada(self):
        """Valida se a senha expirou (apenas para usuários não-admin)."""
        if self.access_level == 'ADMIN':
            return False
        # se por acaso estiver nulo, considere expirada (opcional, mas mais seguro):
        base = self.senha_alterada_em or (timezone.now() - timedelta(days=365*50))
        return timezone.now() > base + timedelta(days=30)

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