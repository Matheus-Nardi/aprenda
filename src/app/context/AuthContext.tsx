// app/context/AuthContext.tsx
"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from "js-cookie"
import { Login } from '@/types/User/Login';
import { User } from '@/types/User/User';
import { AuthService } from '@/lib/services/AuthService';
import { EProfile } from '@/types/User/EProfile';


interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
  login: (credentials: Login) => Promise<void>;
}


export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
      
        const userLogged = await AuthService.profile();
        setUser(userLogged);
      } catch (error) {
        console.log("Sessão não encontrada ou token inválido, deslogando.");
        setUser(null); 
        await AuthService.logout(); 
        router.push('/login');
      } finally {

        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const login = async (credentials: Login) => {
    try {
   
      const token = await AuthService.login(credentials);
      
     
      Cookies.set('auth_token', token, { 
        expires: 7, 
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'strict'
      });
      const userProfile= await AuthService.profile();
      setUser(userProfile);
    } catch (error) {
      setUser(null);
      throw error;
    }
  };
    
  const logout = async () => {
    await AuthService.logout();
    setUser(null);
    router.push('/login');
  };


  const value = { user, loading, logout, login};

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} 
    </AuthContext.Provider>
  );
};