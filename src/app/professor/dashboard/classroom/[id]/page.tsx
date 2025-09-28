import { Classroom } from "@/types/Classroom/Classroom";
import { useEffect, useState } from "react";

interface ClassroomPageProps {
  params: Promise<{ id: string }>;
}
export default function ClassroomPage({params}: ClassroomPageProps) {
    const [classroom, setClassroom] = useState<Classroom | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
     useEffect(() => {
    const loadCronograma = async () => {
      try {
        setLoading(true);
        const { id } = await params;
        // const data = await CronogramaService.buscarCronogramaPorID(id);

        // if (!data) {
        //   setError("Turma não encontrada");
        //   return;
        // }

        // setClassroom(data);
      } catch (error) {
        console.error("Erro ao carregar turma:", error);
        setError("Erro ao carregar turma");
      } finally {
        setLoading(false);
      }
    };

    loadCronograma();
  }, [params]);



}