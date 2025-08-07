import { Role } from "../enums/role.enum";
export interface JwtPayload {
    sub: string;
    phoneNumber: string;
    role: Role;
    name: string;
}
