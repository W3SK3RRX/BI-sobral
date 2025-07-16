from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("dashboards.urls")),  # <- aqui já está incluindo /api/token/ com sua view customizada
]
