import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { motion } from 'framer-motion';
import { dashboardAPI, userAPI } from '@/lib/api';

const NovoDashboard = () => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [link, setLink] = useState('');
  const [categoria, setCategoria] = useState('');
  const [nivelMinimo, setNivelMinimo] = useState('USUARIO');
  const [usuariosPermitidos, setUsuariosPermitidos] = useState([]);

  const [categorias, setCategorias] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    dashboardAPI.getCategories().then(setCategorias).catch(console.error);
    userAPI.getUsers().then(setUsuarios).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const novoDashboard = {
      nome,
      descricao,
      link,
      categoria,
      nivel_minimo: nivelMinimo,
      usuarios_permitidos: usuariosPermitidos,
    };
    await dashboardAPI.createDashboard(novoDashboard);
    navigate('/admin');
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
        <h2 className="text-2xl font-bold mb-6">+ Novo Dashboard</h2>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md space-y-4">
          <div>
            <label className="block font-semibold mb-1">Nome:</label>
            <input value={nome} onChange={e => setNome(e.target.value)} required className="w-full border p-2 rounded" />
          </div>

          <div>
            <label className="block font-semibold mb-1">Descrição:</label>
            <textarea value={descricao} onChange={e => setDescricao(e.target.value)} className="w-full border p-2 rounded" />
          </div>

          <div>
            <label className="block font-semibold mb-1">Link (URL):</label>
            <input type="url" value={link} onChange={e => setLink(e.target.value)} required className="w-full border p-2 rounded" />
          </div>

          <div>
            <label className="block font-semibold mb-1">Categoria:</label>
            <select value={categoria} onChange={e => setCategoria(e.target.value)} className="w-full border p-2 rounded">
              <option value="">Selecione uma categoria</option>
              {categorias.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Nível Mínimo:</label>
            <select value={nivelMinimo} onChange={e => setNivelMinimo(e.target.value)} className="w-full border p-2 rounded">
              <option value="ADMIN">Administrador</option>
              <option value="GESTOR">Gestor</option>
              <option value="USUARIO">Usuário Comum</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Usuários Permitidos (opcional):</label>
            <select multiple value={usuariosPermitidos} onChange={e => setUsuariosPermitidos(Array.from(e.target.selectedOptions, option => option.value))} className="w-full border p-2 rounded h-32">
              {usuarios.map(u => (
                <option key={u.id} value={u.id}>{u.username}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded">
            Salvar Dashboard
          </button>
        </form>
      </motion.main>
    </div>
  );
};

export default NovoDashboard;
