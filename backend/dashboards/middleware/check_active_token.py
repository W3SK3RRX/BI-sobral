from django.utils.deprecation import MiddlewareMixin
from rest_framework_simplejwt.tokens import AccessToken
from dashboards.models import ActiveSession
from rest_framework.exceptions import AuthenticationFailed

EXCLUDED_PATHS = [
    '/api/token/',
    '/api/token/refresh/',
    '/api/trocar-senha-expirada/',  # ✅ NOVO: fluxo sem sessão não pode ser barrado
    '/api/trocar-senha/',           # ✅ Recomendado (se desejar permitir troca autenticada mesmo sem ActiveSession)
]

class ActiveSessionMiddleware(MiddlewareMixin):
    def process_request(self, request):
        # 1) pular middleware para rotas fora de sessão:
        if any(request.path.startswith(p) for p in EXCLUDED_PATHS):
            return

        auth_header = request.META.get('HTTP_AUTHORIZATION', '')

        # 2) só valida quando há Bearer
        if not auth_header.startswith('Bearer '):
            return

        token = auth_header.split(' ')[1]

        try:
            access_token = AccessToken(token)
            user_id = access_token['user_id']
            session = ActiveSession.objects.filter(user_id=user_id).first()
            if not session:
                raise AuthenticationFailed("Sua sessão não é mais válida.")
        except AuthenticationFailed as e:
            raise e
        except Exception:
            # Tokens inválidos/expirados podem ser tratados por views/permission classes
            # Evitar mascarar toda a requisição aqui.
            return
