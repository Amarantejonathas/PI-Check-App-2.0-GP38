import { User, Mail, Lock, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import React, { useState } from 'react';

import { supabase } from '../services/supabase';

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setErrorMessage('');

    try {
      // Cadastro no Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Verifica se usuário foi criado
      const user = data.user;

      if (!user) {
        throw new Error('Usuário não foi criado.');
      }

      // Salvar perfil do usuário
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          name,
          email,
        });

      if (profileError) {
        throw profileError;
      }

      alert('Conta criada com sucesso!');

      navigate('/login');
    } catch (error: any) {
      console.error(error);

      setErrorMessage(
        error.message || 'Erro ao criar conta.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background-light min-h-screen relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute -top-[10%] -right-[10%] w-[300px] h-[300px] rounded-full bg-primary/10 blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-[10%] -left-[10%] w-[300px] h-[300px] rounded-full bg-primary/10 blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col max-w-[448px] mx-auto w-full px-8 py-12 relative z-10"
      >
        <header className="flex flex-col items-center text-center mb-10">
          <Link to="/" className="mb-8">
            <h1 className="font-display text-4xl font-bold tracking-tight text-text-main">
              Check-App
            </h1>
          </Link>

          <div className="space-y-1">
            <h2 className="font-display text-2xl font-bold text-text-main">
              Criar conta
            </h2>

            <p className="text-body-medium text-text-muted">
              Preencha os dados para começar
            </p>
          </div>
        </header>

        <form
          onSubmit={handleRegister}
          className="bg-surface border border-border-light shadow-sm p-8 rounded-lg flex flex-col space-y-6"
        >
          {/* Nome */}
          <div className="flex flex-col space-y-2">
            <label
              className="text-[13px] font-semibold text-text-muted uppercase tracking-wider"
              htmlFor="name"
            >
              Nome
            </label>

            <div className="relative group">
              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors"
              />

              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
                required
                className="w-full h-14 bg-surface border border-border-light rounded-lg pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none font-body text-text-main placeholder:text-text-muted/50"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col space-y-2">
            <label
              className="text-[13px] font-semibold text-text-muted uppercase tracking-wider"
              htmlFor="email"
            >
              E-mail
            </label>

            <div className="relative group">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors"
              />

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full h-14 bg-surface border border-border-light rounded-lg pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none font-body text-text-main placeholder:text-text-muted/50"
              />
            </div>
          </div>

          {/* Senha */}
          <div className="flex flex-col space-y-2">
            <label
              className="text-[13px] font-semibold text-text-muted uppercase tracking-wider"
              htmlFor="password"
            >
              Senha
            </label>

            <div className="relative group">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors"
              />

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full h-14 bg-surface border border-border-light rounded-lg pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none font-body text-text-main placeholder:text-text-muted/50"
              />
            </div>
          </div>

          {/* Mensagem de erro */}
          {errorMessage && (
            <div className="text-red-500 text-sm font-medium">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-primary text-white font-semibold text-[13px] uppercase tracking-widest rounded-lg shadow-glow active:scale-[0.98] transition-all flex items-center justify-center mt-2 hover:bg-primary-dark disabled:opacity-50"
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <footer className="mt-8 flex flex-col items-center space-y-6">
          <Link
            to="/login"
            className="text-[13px] font-bold text-primary uppercase tracking-widest hover:opacity-80 transition-opacity flex items-center"
          >
            <ArrowLeft size={16} className="mr-2" />
            Voltar para Login
          </Link>

          <div className="w-24 h-[1px] bg-border-light" />

          <p className="text-[13px] font-medium text-text-muted max-w-[280px] text-center leading-relaxed">
            Ao se cadastrar, você concorda com nossos{' '}
            <span className="text-text-main cursor-pointer hover:underline">
              Termos de Uso
            </span>{' '}
            e{' '}
            <span className="text-text-main cursor-pointer hover:underline">
              Política de Privacidade
            </span>.
          </p>
        </footer>
      </motion.div>
    </div>
  );
}
