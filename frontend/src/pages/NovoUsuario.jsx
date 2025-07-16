import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { motion } from 'framer-motion';
import { userAPI } from '@/lib/api';

const NovoUsuario = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accessLevel, setAccessLevel] = useState('USUARIO');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const novoUsuario = {
      username,
      email,
      password,
      access_level: accessLevel,
    };

    try {
      await userAPI.createUser(novoUsuario);
      navigate('/admin'); // ou para uma lista de usuários
    } catch (err) {
      console.error('Erro ao criar usuário:', err);
      alert('Erro ao criar usuário.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-orange-light">
      <Header />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <h2 className="text-2xl font-bold mb-6">+ Novo Usuário</h2>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md space-y-4 max-w-xl mx-auto">
          <div>
            <label className="block font-semibold mb-1">Nome de usuário:</label>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">E-mail:</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Senha:</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Nível de acesso:</label>
            <select
              value={accessLevel}
              onChange={e => setAccessLevel(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="ADMIN">Administrador</option>
              <option value="GESTOR">Gestor</option>
              <option value="USUARIO">Usuário Comum</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
          >
            Criar Usuário
          </button>
        </form>
      </motion.main>
    </div>
  );
};

export default NovoUsuario;
