import { UserRole, UserStatus } from "./enum.model";

export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    status: UserStatus;
}