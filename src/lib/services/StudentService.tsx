
import { Classroom } from '@/types/Classroom/Classroom';
import { Homework } from '@/types/Post/Homework';
import { Post } from '@/types/Post/Post';
import { Submission } from '@/types/Submission/Submission';
import axios from 'axios'; 
import Cookies from 'js-cookie';

interface PostPayload{
    title: string;
    content: string;
    isFixed?: boolean;
    attachmentsIds?: number[];
}
export const StudentService = {
  async getClassrooms(): Promise<Classroom[]>{
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/student/classrooms`,
        {
          headers: {
            'Authorization': `Bearer ${Cookies.get('auth_token')}`,
            'Content-Type': 'application/json',
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar salas de aula do aluno:", error);
      throw error;
    }
  },

  async joinClassroom(code: string): Promise<void>{
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/classroom/${code}/join`,null,
        {
          headers: {
            'Authorization': `Bearer ${Cookies.get('auth_token')}`,
            'Content-Type': 'application/json',
          }
        }
      );
    } catch (error) {
      console.error("Erro ao entrar na sala de aula:", error);
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
        `${process.env.NEXT_PUBLIC_API_URL}/student/classrooms/${classroomId}/homeworks`,
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

   async getSubmissionByHomework(idHomework: number): Promise<Submission[] | null>{
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/student/homeworks/${idHomework}/submissions`,
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

  async sendSubmission(homeworkId: number, homeworkPayload: any): Promise<void> {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/student/homeworks/${homeworkId}/submissions`,
        homeworkPayload,
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




};