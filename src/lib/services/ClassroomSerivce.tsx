
    import { Classroom } from '@/types/Classroom/Classroom';
    import axios from 'axios'; 
    import Cookies from 'js-cookie';


    export const ClassroomService = {
    async getClassroomById(id: number): Promise<Classroom | null>{
        try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/classroom/${id}`,
            {
            headers: {
                'Authorization': `Bearer ${Cookies.get('auth_token')}`,
                'Content-Type': 'application/json',
            }
            }
        );
        return response.data;
        } catch (error) {
        console.error("Erro ao buscar salas de aula:", error);
        throw error;
        }
    }
    };