import {
  Mail,
  Lock,
  LogIn,
} from 'lucide-react';

import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import React, { useState } from 'react';

import { supabase } from '../services/supabase';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // LOGIN
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setErrorMessage('');

    try {
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error('Usuário não encontrado.');
      }

      navigate('/');
    } catch (error: any) {
      console.error(error);

      setErrorMessage(
        error.message || 'Erro ao realizar login.'
      );
    } finally {
      setLoading(false);
    }
  };

  // RECUPERAÇÃO DE SENHA
  const handleForgotPassword = async () => {
    if (!email) {
      setErrorMessage(
        'Digite seu e-mail para recuperar a senha.'
      );
      return;
    }

    try {
      const { error } =
        await supabase.auth.resetPasswordForEmail(
          email
        );

      if (error) {
        throw error;
      }

      alert(
        'E-mail de recuperação enviado com sucesso.'
      );
    } catch (error: any) {
      console.error(error);

      setErrorMessage(
        error.message ||
          'Erro ao enviar recuperação de senha.'
      );
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white min-h-screen px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col max-w-[360px] mx-auto w-full"
      >
        {/* HEADER */}
        <div className="mb-12">
          <Link
            to="/"
            className="inline-block mb-8"
          >
            <h1 className="font-display text-4xl font-bold tracking-tight text-primary">
              Check-App
            </h1>
          </Link>

          <h2 className="font-display text-3xl font-bold text-text-main mb-2">
            Bem-vindo
          </h2>

          <p className="text-text-muted">
            Acesse sua conta para gerenciar seus
            eventos com máxima eficiência.
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleLogin}
          className="space-y-6"
        >
          {/* EMAIL */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest ml-1">
              E-mail
            </label>

            <div className="relative group">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors"
              />

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="exemplo@email.com"
                required
                className="w-full h-14 bg-background-light border border-transparent rounded-xl pl-12 pr-4 focus:bg-white focus:border-primary transition-all outline-none font-body text-text-main"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest">
                Senha
              </label>

              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-[11px] font-bold text-primary uppercase tracking-widest hover:underline"
              >
                Esqueci a senha
              </button>
            </div>

            <div className="relative group">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors"
              />

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="********"
                required
                minLength={6}
                className="w-full h-14 bg-background-light border border-transparent rounded-xl pl-12 pr-4 focus:bg-white focus:border-primary transition-all outline-none font-body text-text-main"
              />
            </div>
          </div>

          {/* ERROR */}
          {errorMessage && (
            <div className="text-red-500 text-sm font-medium">
              {errorMessage}
            </div>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-16 bg-primary text-white font-display font-bold text-lg rounded-xl shadow-glow hover:bg-primary-dark transition-all active:scale-[0.98] flex items-center justify-center gap-2 group mt-4 disabled:opacity-50"
          >
            <span>
              {loading
                ? 'Entrando...'
                : 'Entrar na Conta'}
            </span>

            <LogIn
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </form>

        {/* FOOTER */}
        <div className="mt-auto pt-12 text-center">
          <p className="text-text-muted text-sm">
            Não tem uma conta?{' '}
            <Link
              to="/register"
              className="text-primary font-bold hover:underline"
            >
              Cadastre-se
            </Link>
          </p>
        </div>

        {/* SOCIAL LOGIN PLACEHOLDER */}
        <div className="mt-8 flex justify-center gap-4">
          <div className="w-10 h-10 rounded-full bg-background-light flex items-center justify-center text-[10px] font-bold text-text-muted border border-border-light cursor-pointer hover:bg-white transition-colors">
            G
          </div>

          <div className="w-10 h-10 rounded-full bg-background-light flex items-center justify-center text-[10px] font-bold text-text-muted border border-border-light cursor-pointer hover:bg-white transition-colors">
            A
          </div>
        </div>
      </motion.div>
    </div>
  );
}
