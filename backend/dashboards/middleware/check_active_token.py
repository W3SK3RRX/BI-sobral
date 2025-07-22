from django.utils.deprecation import MiddlewareMixin
from rest_framework_simplejwt.tokens import AccessToken
from dashboards.models import ActiveSession
from rest_framework.exceptions import AuthenticationFailed

class ActiveSessionMiddleware(MiddlewareMixin):
    def process_request(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')

        if auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]

            try:
                access_token = AccessToken(token)
                user_id = access_token['user_id']

                # ✅ Verifica se a sessão ativa existe
                session = ActiveSession.objects.filter(user_id=user_id).first()
                if not session:
                    raise AuthenticationFailed("Sua sessão não é mais válida.")

                # ✅ Garante que o token pertence ao Refresh ativo (extra segurança)
                if str(token) not in session.refresh_token:
                    raise AuthenticationFailed("Este token não é mais válido. Faça login novamente.")

            except AuthenticationFailed as e:
                raise e
            except Exception:
                pass  # Ignora se não for JWT válido
