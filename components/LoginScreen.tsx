import React, { useState } from 'react';

interface LoginScreenProps {
  onLogin: (password: string) => boolean;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = onLogin(password);
    if (!success) {
      setError('Senha incorreta. Por favor, tente novamente.');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <header className="text-center mb-8">
          <p className="text-lg font-medium text-slate-300 mb-2">VOLL Pilates Group</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 tracking-tight mb-2">Calculadora de Combustível</h1>
          <p className="text-slate-400">Por favor, insira a senha para continuar.</p>
        </header>

        <main className="bg-slate-800 rounded-2xl shadow-2xl shadow-cyan-500/10 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-900/50 border border-red-700 text-red-300 rounded-lg text-center text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full flex justify-center items-center py-3 px-4 bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-bold rounded-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
            >
              Entrar
            </button>
          </form>
        </main>
        
        <footer className="mt-8 text-center text-sm text-slate-500">
          <p>Desenvolvido com Google Gemini</p>
        </footer>
      </div>
    </div>
  );
};

export default LoginScreen;