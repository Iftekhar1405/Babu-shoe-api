import { AuthService } from './auth.service';
import { RegisterDto } from 'src/users/dto/register.dto';
import { LoginDto } from 'src/users/dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        user: import("../users/schemas/user.schemas").User;
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: import("../users/schemas/user.schemas").User;
    }>;
    getProfile(req: any): any;
    adminOnlyRoute(req: any): {
        message: string;
        user: any;
    };
}
