
import { Login } from '@/types/User/Login';
import axios from 'axios'; 
import Cookies from 'js-cookie';

interface RegisterPayload{
  name:string,
  email:string,
  password:string,
  profile: number,
  avatarId: number | null
}
export const AuthService = {
  async login(login: Login): Promise<string> {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        login,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      let token = response.data.token;
      return token;
    } catch (error) {
      console.error("Erro ao fazer login no serviço:", error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      Cookies.remove('auth_token'); 
    } catch (error) {
      console.error("Erro ao fazer logout no serviço:", error);
      throw error;
    }
},

  async profile(): Promise<any> {
    try {
      const token = Cookies.get('auth_token');
      if (!token) {
        return null;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar perfil do usuário:", error);
      throw error;
    }
  },

  async register(register: RegisterPayload): Promise<void>{
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/user`,
        register,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    } catch (error) {
      console.error("Erro ao fazer registro no serviço:", error);
      throw error;
    }
  }

};