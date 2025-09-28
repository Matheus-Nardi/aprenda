
import { ESubmissionStatus } from "./ESubmissionStatus";
import { Grade } from "../Grade/Grade";
import { Archive } from "../Archive/Archive";
import { User } from "../User/User";
import { Homework } from "../Post/Homework";

export interface Submission {
    id: number;
    submittedAt: string;
    status: ESubmissionStatus;
    grade?: Grade;
    user: User;
    homework: Homework;
    archives: Archive[];
}

