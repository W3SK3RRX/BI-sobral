from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import User, Category, Dashboard
from .serializers import UserSerializer, CategorySerializer, DashboardSerializer
from .serializers import TrocarSenhaSerializer
from django.db.models import Q
from django.utils import timezone


# 🔐 View personalizada para login via e-mail
UserModel = get_user_model()

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        email = attrs.get("username")  # frontend envia "username", mas é o e-mail
        password = attrs.get("password")

        try:
            user = UserModel.objects.get(email=email)
        except UserModel.DoesNotExist:
            raise AuthenticationFailed("E-mail não encontrado.")

        if not user.check_password(password):
            raise AuthenticationFailed("Senha incorreta.")

        # 🔐 Verifica se a senha expirou
        if user.senha_expirada():
            raise AuthenticationFailed("Sua senha expirou. Por favor, altere sua senha para continuar.")

        # Gera token
        data = super().get_token(user)
        return {
            "access": str(data.access_token),
            "refresh": str(data),
        }

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


#@api_view(['GET'])
#@permission_classes([IsAuthenticated])
#def me_view(request):
#    user = request.user
#    return Response({
#        "id": user.id,
#        "username": user.username,
#        "email": user.email,
#        "access_level": user.access_level,
#    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_me(request):
    user = request.user
    return Response({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "access_level": user.access_level,
        "primeiro_acesso": user.primeiro_acesso  # 👈 adicione isso
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

        if user.access_level == 'ADMIN':
            niveis_permitidos = ['ADMIN', 'GESTOR', 'USUARIO']
        elif user.access_level == 'GESTOR':
            niveis_permitidos = ['GESTOR', 'USUARIO']
        else:
            niveis_permitidos = ['USUARIO']

        return Dashboard.objects.filter(
            Q(nivel_minimo__in=niveis_permitidos) |
            Q(usuarios_permitidos=user)
        ).distinct()


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def trocar_senha(request):
    serializer = TrocarSenhaSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()

        # 👇 Após trocar a senha, atualiza o campo primeiro_acesso
        user = request.user
        user.primeiro_acesso = False
        user.senha_alterada_em = timezone.now()
        user.save()

        return Response({'mensagem': 'Senha alterada com sucesso.'})
    return Response(serializer.errors, status=400)
