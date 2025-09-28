import { Post } from "./Post";
import { Submission } from "./Submission";

export interface Homework extends Post  {
    dueDate: string;
    submissions: Submission[];
}


