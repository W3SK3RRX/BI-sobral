import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth.jsx';
import { authAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Mail, Lock, Shield, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const ChangePasswordForm = ({ mode = 'auth' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Detecta modo expirado também por querystring (?expired=1)
  const qs = new URLSearchParams(location.search);
  const expiredByQS = qs.get('expired') === '1';
  const expiredMode = mode === 'expired' || expiredByQS;

  // Prefere email do sessionStorage (definido no fluxo de expiração); fallback user?.email
  const initialEmail = (typeof window !== 'undefined' && sessionStorage.getItem('login_email')) || user?.email || '';

  const [email, setEmail] = useState(initialEmail);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Refs para foco inteligente
  const emailRef = useRef(null);
  const currentRef = useRef(null);

  useEffect(() => {
    // Foco: se modo expirado e temos email, foca na senha atual; senão, no email.
    if (expiredMode && initialEmail) {
      currentRef.current?.focus();
    } else if (expiredMode && !initialEmail) {
      emailRef.current?.focus();
    } else {
      currentRef.current?.focus();
    }
  }, [expiredMode, initialEmail]);

  const requirements = useMemo(
    () => [
      { text: 'Pelo menos 8 caracteres', met: newPassword.length >= 8 },
      { text: 'Pelo menos uma letra maiúscula', met: /[A-Z]/.test(newPassword) },
      { text: 'Pelo menos uma letra minúscula', met: /[a-z]/.test(newPassword) },
      { text: 'Pelo menos um número', met: /\d/.test(newPassword) },
    ],
    [newPassword]
  );

  const isPasswordValid = requirements.every((r) => r.met);
  const passwordsMatch = newPassword === confirmPassword && newPassword.length > 0;

  const normalizeError = (err) => {
    const data = err?.response?.data;
    const fallback = err?.message || 'Erro ao alterar a senha.';
    if (!data) return fallback;

    // detail pode ser string ou objeto {code,message}
    if (typeof data.detail === 'string') return data.detail;
    if (data.detail && typeof data.detail === 'object') {
      return data.detail.message || JSON.stringify(data.detail);
    }
    if (typeof data.mensagem === 'string') return data.mensagem;

    const key = Object.keys(data)[0];
    if (key) {
      const v = data[key];
      return Array.isArray(v) ? String(v[0]) : String(v);
    }
    return fallback;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (expiredMode && !email) return setError('Informe o e-mail.');
    if (!currentPassword) return setError('Informe a senha atual.');
    if (!isPasswordValid) return setError('A nova senha não atende aos requisitos de segurança.');
    if (!passwordsMatch) return setError('As senhas não coincidem.');

    setLoading(true);
    try {
      if (expiredMode) {
        // Rota AllowAny; api.js já garante sem Authorization
        await authAPI.changePasswordExpired(email, currentPassword, newPassword, confirmPassword);
        sessionStorage.removeItem('login_email');
        setSuccess('Senha alterada. Faça login novamente.');
        setTimeout(() => navigate('/login'), 900);
      } else {
        await authAPI.changePassword(currentPassword, newPassword, confirmPassword);
        setSuccess('Senha alterada com sucesso.');
        setTimeout(() => navigate('/dashboard'), 700);
      }
    } catch (err) {
      setError(normalizeError(err));
    } finally {
      setLoading(false);
    }
  };

  const emailReadOnly = expiredMode && Boolean(initialEmail);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-orange-light p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-orange-lg border-0">
          <CardHeader className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mx-auto w-16 h-16 bg-gradient-orange rounded-full flex items-center justify-center"
            >
              <Shield className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <CardTitle className="text-2xl font-bold text-gradient-orange">Alterar Senha</CardTitle>
              <CardDescription className="text-muted-foreground">
                {expiredMode
                  ? 'Sua senha expirou. Informe seus dados para definir uma nova senha.'
                  : user?.primeiro_acesso
                  ? 'Por segurança, altere sua senha no primeiro acesso.'
                  : 'Defina uma nova senha para sua conta.'}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              {success && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                  <Alert>
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              {expiredMode && (
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`pl-10 border-gradient-orange focus:ring-primary ${emailReadOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                      ref={emailRef}
                      required
                      readOnly={emailReadOnly}
                    />
                  </div>
                  {emailReadOnly && (
                    <p className="text-xs text-muted-foreground">Este e-mail veio do login anterior.</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="currentPassword">Senha Atual</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="currentPassword"
                    type={show.current ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="pl-10 pr-10 border-gradient-orange focus:ring-primary"
                    ref={currentRef}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => ({ ...s, current: !s.current }))}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-primary transition-colors"
                    aria-label={show.current ? 'Ocultar senha atual' : 'Mostrar senha atual'}
                  >
                    {show.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    type={show.new ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 pr-10 border-gradient-orange focus:ring-primary"
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => ({ ...s, new: !s.new }))}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-primary transition-colors"
                    aria-label={show.new ? 'Ocultar nova senha' : 'Mostrar nova senha'}
                  >
                    {show.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {newPassword && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="space-y-1"
                >
                  {requirements.map((req, i) => (
                    <div
                      key={i}
                      className={`flex items-center space-x-2 text-sm ${req.met ? 'text-green-600' : 'text-muted-foreground'}`}
                    >
                      <CheckCircle className={`h-3 w-3 ${req.met ? 'text-green-600' : 'text-gray-300'}`} />
                      <span>{req.text}</span>
                    </div>
                  ))}
                </motion.div>
              )}

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={show.confirm ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`pl-10 pr-10 border-gradient-orange focus:ring-primary ${
                      confirmPassword && !passwordsMatch ? 'border-red-300' : ''
                    }`}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-primary transition-colors"
                    aria-label={show.confirm ? 'Ocultar confirmação' : 'Mostrar confirmação'}
                  >
                    {show.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {confirmPassword && !passwordsMatch && (
                  <p className="text-sm text-red-600">As senhas não coincidem</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                disabled={loading || !isPasswordValid || !passwordsMatch}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    aria-label="Enviando"
                  />
                ) : (
                  'Alterar Senha'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
