import { Archive } from "../Archive/Archive";
import { User } from "../User/User";

export interface Classroom {
    id: number;
    name: string;
    description: string;
    createdAt: string; 
    updatedAt: string; 
    users: User[];
    banner: Archive | null;
    avatar: Archive | null;
    inviteCode: string;
}
