// context/auth.tsx
import React, { createContext, useState, useContext } from 'react';

// Cria o alto-falante
const AuthContext = createContext<any>(null);

// O provedor que vai abraçar o app inteiro
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLogged, setIsLogged] = useState(false); // Começa deslogado

  const login = () => setIsLogged(true); // Função pra logar
  const logout = () => setIsLogged(false); // Função pra deslogar

  return (
    <AuthContext.Provider value={{ isLogged, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// O gancho que a gente usa nas telas pra escutar o alto-falante
export function useAuth() {
  return useContext(AuthContext);
}