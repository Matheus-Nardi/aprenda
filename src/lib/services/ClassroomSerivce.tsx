import { Classroom } from "@/types/Classroom/Classroom";
import { Homework } from "@/types/Post/Homework";
import { User } from "@/types/User/User";
import axios from "axios";
import Cookies from "js-cookie";

interface ClassroomPayload{
    name: string;
    description: string;
}

export const ClassroomService = {
  async getClassroomById(id: number): Promise<Classroom | null> {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/classroom/${id}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("auth_token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar salas de aula:", error);
      throw error;
    }
  },

  async createClassroom(classroom: ClassroomPayload): Promise<Classroom | null> {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/classroom`,
        classroom,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("auth_token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao criar sala de aula:", error);
      throw error;
    }
  },


  async getHomeworkById(idHomework: number): Promise<Homework | null>{
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/classroom/homework/${idHomework}`,
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


    async getStudentsByClassroom(idClassroom: number): Promise<User[] | null>{
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/classroom/${idClassroom}/students`,
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
