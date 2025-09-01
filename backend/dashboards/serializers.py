from rest_framework import serializers
from .models import User, Category, Dashboard
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import ActiveSession

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "last_name",
            "email",
            "access_level",
            "password"
        )
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def create(self, validated_data):
        if not validated_data.get('username'):
            validated_data['username'] = validated_data['email'].split('@')[0]

        user = User.objects.create_user(**validated_data)
        user.senha_alterada_em = timezone.now() # <-- ALTERAÇÃO AQUI
        user.save()
        return user


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class DashboardSerializer(serializers.ModelSerializer):
    categoria = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        required=False,
        allow_null=True
    )

    usuarios_permitidos = serializers.PrimaryKeyRelatedField(
        many=True, queryset=User.objects.all(), required=False
    )

    class Meta:
        model = Dashboard
        fields = [
            'id', 'nome', 'descricao', 'link', 'categoria',
            'nivel_minimo', 'usuarios_permitidos'
        ]


class TrocarSenhaSerializer(serializers.Serializer):
    nova_senha = serializers.CharField(write_only=True, min_length=6)

    def validate_nova_senha(self, nova_senha):
        user = self.context['request'].user
        if user.check_password(nova_senha):
            raise serializers.ValidationError("A nova senha não pode ser igual à anterior.")
        return nova_senha

    def save(self):
        user = self.context['request'].user
        user.set_password(self.validated_data['nova_senha'])
        user.senha_alterada_em = timezone.now()
        user.save()
        return user
    

class TrocarSenhaExpiradaSerializer(serializers.Serializer):
    email = serializers.EmailField()
    senha_atual = serializers.CharField(write_only=True)
    nova_senha = serializers.CharField(write_only=True)
    confirmacao = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        senha_atual = attrs.get('senha_atual')
        nova = attrs.get('nova_senha')
        conf = attrs.get('confirmacao')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({'email': 'Usuário não encontrado.'})

        if not user.check_password(senha_atual):
            raise serializers.ValidationError({'senha_atual': 'Senha atual inválida.'})

        if nova != conf:
            raise serializers.ValidationError({'confirmacao': 'Confirmação não confere.'})

        validate_password(nova, user)
        attrs['user'] = user
        return attrs

    def save(self):
        user = self.validated_data['user']
        user.set_password(self.validated_data['nova_senha'])
        user.senha_alterada_em = timezone.now()
        user.primeiro_acesso = False
        user.save()
        # encerra refresh/sessão ativa
        ActiveSession.objects.filter(user=user).delete()
        return user