import { Archive } from '@/types/Archive/Archive';
import axios from 'axios';
import Cookies from 'js-cookie';
export const ArchiveService = {


     async uploadFile(file: File): Promise<Archive> { 
    try {
   
      const formData = new FormData();
      
  
      formData.append('file', file);

      const response = await axios.post(

        `${process.env.NEXT_PUBLIC_API_URL}/archive/upload`,
        formData, // 3. Envie o formData em vez de um objeto JSON
        {
          headers: {
            'Authorization': `Bearer ${Cookies.get('auth_token')}`,
          }
        }
      );
      
      return response.data;

    } catch (error) {
      console.error("Erro ao fazer upload do arquivo:", error);
      throw error;
    }
  },

  async download(): Promise<void> {


  }

}