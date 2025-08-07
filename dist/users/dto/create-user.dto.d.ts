import { Role } from 'src/common/enums/role.enum';
export declare class CreateUserDto {
    name: string;
    phoneNumber: string;
    password: string;
    role?: Role;
}
