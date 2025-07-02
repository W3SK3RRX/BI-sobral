from rest_framework import serializers
from .models import User, Category, Dashboard
from rest_framework import serializers
from django.utils import timezone

from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "access_level",
            "password",
        )
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
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

