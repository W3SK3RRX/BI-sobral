import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { motion } from 'framer-motion';
import { userAPI } from '@/lib/api';

const EditarUsuario = () => {
    const { id } = useParams(); // pega o id da rota /usuarios/:id/edit
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); // Pode ficar vazio (se não quiser alterar a senha)
    const [accessLevel, setAccessLevel] = useState('USUARIO');
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        // Buscar os dados do usuário para preencher o formulário
        const fetchUser = async () => {
            try {
                const user = await userAPI.getUser(id);
                setUsername(user.username);
                setEmail(user.email);
                setAccessLevel(user.access_level);
                setLoading(false);
            } catch (err) {
                console.error('Erro ao carregar usuário:', err);
                alert('Erro ao carregar dados do usuário.');
                navigate('/admin'); // volta para a lista
            }
        };

        fetchUser();
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dadosAtualizados = {
            username,
            email,
            access_level: accessLevel,
        };

        // Só enviar a senha se tiver sido digitada (para evitar apagar a senha ao não editar)
        if (password.trim() !== '') {
            dadosAtualizados.password = password;
        }

        try {
            await userAPI.updateUser(id, dadosAtualizados);
            navigate('/admin'); // volta para a lista ou outra rota
        } catch (err) {
            console.error('Erro ao atualizar usuário:', err.response?.data || err);
            alert('Erro ao atualizar usuário.');
        }

    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Carregando dados do usuário...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-orange-light">
            <Header />
            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="container mx-auto px-4 py-8"
            >
                <h2 className="text-2xl font-bold mb-6">Editar Usuário</h2>
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
                        <label className="block font-semibold mb-1">Senha (deixe em branco para manter a atual):</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
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
                        Atualizar Usuário
                    </button>
                </form>
            </motion.main>
        </div>
    );
};

export default EditarUsuario;
