from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Category, Dashboard

class CustomUserAdmin(BaseUserAdmin):
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Nível de Acesso', {'fields': ('access_level',)}),
    )
    list_display = ('username', 'email', 'first_name', 'last_name', 'access_level', 'is_staff')
    list_filter = ('access_level', 'is_staff', 'is_superuser', 'is_active')

admin.site.register(User, CustomUserAdmin)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Dashboard)
class DashboardAdmin(admin.ModelAdmin):
    list_display = ('nome', 'categoria', 'nivel_minimo', 'criado_por', 'criado_em')
    list_filter = ('nivel_minimo', 'categoria')
    search_fields = ('nome', 'descricao')
    autocomplete_fields = ('categoria', 'criado_por')
