
import { Classroom } from '@/types/Classroom/Classroom';
import { Homework } from '@/types/Post/Homework';
import { Post } from '@/types/Post/Post';
import axios from 'axios'; 
import Cookies from 'js-cookie';

interface PostPayload{
    title: string;
    content: string;
    isFixed?: boolean;
    attachmentsIds?: number[];
}
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
  },

  async getClassroomPosts(classroomId: number): Promise<Post[]>{
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/professor/classrooms/${classroomId}/posts`,
        {
          headers: {
            'Authorization': `Bearer ${Cookies.get('auth_token')}`,
            'Content-Type': 'application/json',
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar postagens da sala de aula do professor:", error);
      throw error;
    }
  },

  async getClassroomHomeworks(classroomId: number): Promise<Homework[]>{
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/professor/classrooms/${classroomId}/homeworks`,
        {
          headers: {
            'Authorization': `Bearer ${Cookies.get('auth_token')}`,
            'Content-Type': 'application/json',
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar tarefas da sala de aula do professor:", error);
      throw error;
    }
  },

  async createPost(data: PostPayload, classroomId: number): Promise<Post | null> {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/professor/classrooms/${classroomId}/posts`,
        data,
        {
          headers: {
            'Authorization': `Bearer ${Cookies.get('auth_token')}`,
            'Content-Type': 'application/json',
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao criar postagem na sala de aula do professor:", error);
      throw error;
    }
  },

};