from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import User, Category, Dashboard
from .serializers import UserSerializer, CategorySerializer, DashboardSerializer

# 🔐 View personalizada para login via e-mail
UserModel = get_user_model()

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        email = attrs.get("username")  # o frontend ainda manda como "username"
        password = attrs.get("password")

        try:
            user = UserModel.objects.get(email=email)
        except UserModel.DoesNotExist:
            raise AuthenticationFailed("E-mail não encontrado.")

        if not user.check_password(password):
            raise AuthenticationFailed("Senha incorreta.")

        data = super().get_token(user)
        return {
            "access": str(data.access_token),
            "refresh": str(data),
        }

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_view(request):
    user = request.user
    return Response({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "access_level": user.access_level,
    })


# 👤 Views de gerenciamento
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminUser]

class DashboardViewSet(viewsets.ModelViewSet):
    serializer_class = DashboardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.access_level == 'ADMIN':
            return Dashboard.objects.all()
        elif user.access_level == 'GESTOR':
            return Dashboard.objects.filter(nivel_minimo__in=['GESTOR', 'USUARIO'])
        else:
            return Dashboard.objects.filter(nivel_minimo='USUARIO')
