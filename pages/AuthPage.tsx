
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
// FIX: Removed non-existent 'Envelope' icon and will use 'Mail' instead.
import { LogIn, UserPlus, Mail, Lock, Loader2 } from 'lucide-react';

// Simple SVG component for Google's logo
const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.804 9.692C34.522 5.945 29.638 4 24 4C12.954 4 4 12.954 4 24s8.954 20 20 20s20-8.954 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039L38.804 9.692C34.522 5.945 29.638 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path>
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path>
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.158 44 30.013 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
    </svg>
);

const CheckEmailScreen: React.FC<{ email: string, onBackToLogin: () => void }> = ({ email, onBackToLogin }) => (
    <div className="text-center animate-fade-in">
        <Mail className="w-16 h-16 text-primary mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-dark mb-4">Confirme seu Email</h1>
        <p className="text-gray-600 mb-6">
            Enviamos um link de confirmação para <strong>{email}</strong>. Por favor, verifique sua caixa de entrada (e a pasta de spam!) para ativar sua conta.
        </p>
        <button
            onClick={onBackToLogin}
            className="w-full bg-secondary text-white font-bold py-3 px-4 rounded-lg hover:bg-pink-600 transition-colors"
        >
            Voltar para o Login
        </button>
    </div>
);


const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCheckEmail, setShowCheckEmail] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setShowCheckEmail(false);
    
    if (isLogin) {
      // Handle Login
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        if (error.message === 'Email not confirmed') {
            setError('Seu email ainda não foi confirmado. Verifique sua caixa de entrada.');
        } else {
            setError('Email ou senha inválidos.');
        }
      } else {
        navigate('/dashboard');
      }
    } else {
      // Handle Sign Up
      const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            // Use a dynamic redirect URL so it works in any environment
            emailRedirectTo: window.location.origin,
          }
      });

      if (error) {
        if (error.message.includes('User already registered')) {
            setError('Este email já está cadastrado. Tente fazer login.');
        } else {
            setError(error.message);
        }
      } else if (data.user) {
        setShowCheckEmail(true);
      }
    }
    setLoading(false);
  };

  const handleSocialLogin = async (provider: 'google') => {
    setLoading(true);
    setError('');
    
    // To solve OAuth issues in iframe environments, we get the URL from Supabase
    // and manually trigger a top-level redirect, which breaks out of the iframe.
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            // Use a dynamic redirect URL so it works in any environment
            redirectTo: window.location.origin,
            skipBrowserRedirect: true, // Important: we handle the redirect manually
        }
    });

    if (error) {
        setError(`Erro ao autenticar com ${provider}: ${error.message}`);
        setLoading(false);
    } else if (data.url) {
        // Redirect the top-level window to the OAuth provider's login page
        window.top!.location.href = data.url;
    }
  };

  const handleBackToLogin = () => {
    setShowCheckEmail(false);
    setIsLogin(true);
    setEmail('');
    setPassword('');
    setError('');
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white p-8 rounded-xl shadow-2xl min-h-[580px] flex flex-col justify-center">
        {showCheckEmail ? (
            <CheckEmailScreen email={email} onBackToLogin={handleBackToLogin} />
        ) : (
          <>
            <h1 className="text-3xl font-bold text-center mb-2 text-dark">{isLogin ? 'Bem-vindo(a) de Volta!' : 'Crie sua Conta'}</h1>
            <p className="text-center text-gray-600 mb-6">{isLogin ? 'Acesse seu painel de controle.' : 'Comece a gerenciar seus agendamentos.'}</p>
            
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="relative">
                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                 <input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 block w-full px-3 py-2 bg-white text-dark border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>

              <div className="relative">
                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                <input
                  id="password"
                  type="password"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="pl-10 block w-full px-3 py-2 bg-white text-dark border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
              
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-secondary text-white font-bold py-3 px-4 rounded-lg hover:bg-pink-600 flex items-center justify-center gap-2 transition-colors disabled:bg-pink-300"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin"/> : (isLogin ? <><LogIn className="w-5 h-5"/> Entrar</> : <><UserPlus className="w-5 h-5"/> Criar Conta</>)}
              </button>
            </form>

            <div className="relative flex py-5 items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-sm">OU</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <div className="space-y-3">
                 <button
                    type="button"
                    onClick={() => handleSocialLogin('google')}
                    disabled={loading}
                    className="w-full bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors disabled:bg-gray-200"
                >
                    <GoogleIcon />
                    <span>Continuar com Google</span>
                </button>
            </div>

            <p className="text-center text-sm text-gray-600 mt-6">
              {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
              <button
                onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                }}
                className="font-semibold text-primary hover:underline ml-1"
              >
                {isLogin ? 'Cadastre-se' : 'Faça login'}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage;