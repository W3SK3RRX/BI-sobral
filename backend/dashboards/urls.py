from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import MyTokenObtainPairView, get_me, trocar_senha, MyTokenRefreshView, trocar_senha_expirada
from django.urls import path


from .views import UserViewSet, CategoryViewSet, DashboardViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'dashboards', DashboardViewSet, basename='dashboard')

urlpatterns = [
    path('', include(router.urls)),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', MyTokenRefreshView.as_view(), name='token_refresh'),
    path('me/', get_me),
    path('trocar-senha/', trocar_senha),
    path('trocar-senha-expirada/', trocar_senha_expirada),
]
