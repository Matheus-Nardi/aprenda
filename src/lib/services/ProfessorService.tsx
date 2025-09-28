
import { Classroom } from '@/types/Classroom/Classroom';
import axios from 'axios'; 
import Cookies from 'js-cookie';


export const ProfessorService = {
  async getClassrooms(): Promise<Classroom[]>{
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/professor/classrooms`,
        {
          headers: {
            'Authorization': `Bearer ${Cookies.get('auth_token')}`,
            'Content-Type': 'application/json',
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar salas de aula do professor:", error);
      throw error;
    }
  }
};