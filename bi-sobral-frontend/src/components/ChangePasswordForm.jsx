import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Lock, Shield, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const ChangePasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { changePassword, user } = useAuth();
  const navigate = useNavigate();

  const passwordRequirements = [
    { text: 'Pelo menos 8 caracteres', met: newPassword.length >= 8 },
    { text: 'Pelo menos uma letra maiúscula', met: /[A-Z]/.test(newPassword) },
    { text: 'Pelo menos uma letra minúscula', met: /[a-z]/.test(newPassword) },
    { text: 'Pelo menos um número', met: /\d/.test(newPassword) },
  ];

  const isPasswordValid = passwordRequirements.every(req => req.met);
  const passwordsMatch = newPassword === confirmPassword && newPassword.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isPasswordValid) {
      setError('A nova senha não atende aos requisitos de segurança.');
      return;
    }

    if (!passwordsMatch) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);

    const result = await changePassword(currentPassword, newPassword);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

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
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-16 h-16 bg-gradient-orange rounded-full flex items-center justify-center"
            >
              <Shield className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <CardTitle className="text-2xl font-bold text-gradient-orange">
                Alterar Senha
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {user?.primeiro_acesso 
                  ? 'Por segurança, altere sua senha no primeiro acesso'
                  : 'Defina uma nova senha para sua conta'
                }
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Senha Atual</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="currentPassword"
                    type={showPasswords.current ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="pl-10 pr-10 border-gradient-orange focus:ring-primary"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    type={showPasswords.new ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 pr-10 border-gradient-orange focus:ring-primary"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {newPassword && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2"
                >
                  <Label className="text-sm text-muted-foreground">Requisitos da senha:</Label>
                  <div className="space-y-1">
                    {passwordRequirements.map((req, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center space-x-2 text-sm ${
                          req.met ? 'text-green-600' : 'text-muted-foreground'
                        }`}
                      >
                        <CheckCircle className={`h-3 w-3 ${req.met ? 'text-green-600' : 'text-gray-300'}`} />
                        <span>{req.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirm ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`pl-10 pr-10 border-gradient-orange focus:ring-primary ${
                      confirmPassword && !passwordsMatch ? 'border-red-300' : ''
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {confirmPassword && !passwordsMatch && (
                  <p className="text-sm text-red-600">As senhas não coincidem</p>
                )}
              </div>
              
              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors"
                disabled={loading || !isPasswordValid || !passwordsMatch}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
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

