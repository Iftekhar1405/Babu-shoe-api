import { AuthService } from "./auth.service";
import { RegisterDto } from "src/users/dto/register.dto";
import { LoginDto } from "src/users/dto/login.dto";
import { Response as ExpressResponse } from "express";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto, res: ExpressResponse): Promise<{
        access_token: string;
        user: import("../users/schemas/user.schemas").User;
    }>;
    login(loginDto: LoginDto, res: ExpressResponse): Promise<{
        access_token: string;
        user: import("../users/schemas/user.schemas").User;
    }>;
    logout(res: ExpressResponse): {
        message: string;
    };
    getProfile(req: any): any;
    adminOnlyRoute(req: any): {
        message: string;
        user: any;
    };
}
