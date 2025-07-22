from django.utils.deprecation import MiddlewareMixin
from rest_framework_simplejwt.tokens import AccessToken
from dashboards.models import ActiveSession

class ActiveSessionMiddleware(MiddlewareMixin):
    def process_request(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')

        if auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]

            try:
                access_token = AccessToken(token)
                user_id = access_token['user_id']

                # ✅ Verifica se existe refresh token ativo para este usuário
                if not ActiveSession.objects.filter(user_id=user_id).exists():
                    from rest_framework.exceptions import AuthenticationFailed
                    raise AuthenticationFailed("Sua sessão não é mais válida.")
            except Exception:
                pass  # ignora se não for token JWT
