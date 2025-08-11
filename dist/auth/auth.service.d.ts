import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { RegisterDto } from "src/users/dto/register.dto";
import { User } from "src/users/schemas/user.schemas";
import { LoginDto } from "src/users/dto/login.dto";
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        user: User;
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: User;
    }>;
}
