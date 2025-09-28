import { User } from "../User/User";

export interface Classroom {
    id: number;
    name: string;
    description: string;
    createdAt: string; 
    updatedAt: string; 
    users: User[];
}
