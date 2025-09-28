import { Classroom } from "../Classroom/Classroom";
import { User } from "../User/User";
import { Archive } from "../Archive/Archive";

export interface Post {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    isFixed: boolean;
    user: User;
    classroom: Classroom;
    archives: Archive[];
}

