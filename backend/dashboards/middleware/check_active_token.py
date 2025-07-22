from django.utils.deprecation import MiddlewareMixin
from rest_framework_simplejwt.tokens import AccessToken
from dashboards.models import ActiveSession
from rest_framework.exceptions import AuthenticationFailed

EXCLUDED_PATHS = ['/api/token/', '/api/token/refresh/']

class ActiveSessionMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if any(request.path.startswith(p) for p in EXCLUDED_PATHS):
            return

        auth_header = request.META.get('HTTP_AUTHORIZATION', '')

        if auth_header.startswith('Bearer '):
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
                pass
