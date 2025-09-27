
import { EProfile } from "./EProfile";

export interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
  profile: EProfile;
}