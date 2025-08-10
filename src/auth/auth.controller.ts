import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  Response,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { RolesGuard } from "./guards/roles.guard";
import { Roles } from "./decorators/roles.decorator";
import { Role } from "../common/enums/role.enum";
import { RegisterDto } from "src/users/dto/register.dto";
import { LoginDto } from "src/users/dto/login.dto";
import { Response as ExpressResponse } from "express";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  async register(
    @Body() registerDto: RegisterDto,
    @Response({ passthrough: true }) res: ExpressResponse
  ) {
    const result = await this.authService.register(registerDto);

    // Set JWT token as httpOnly cookie
    res.cookie("access_token", result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 300 * 24 * 60 * 60 * 1000, // 1 yr
    });

    return result;
  }

  @Post("login")
  async login(
    @Body() loginDto: LoginDto,
    @Response({ passthrough: true }) res: ExpressResponse
  ) {
    const result = await this.authService.login(loginDto);

    // Set JWT token as httpOnly cookie
    res.cookie("access_token", result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 300 * 24 * 60 * 60 * 1000, // 1 year
    });

    return result;
  }

  @Post("logout")
  logout(@Response({ passthrough: true }) res: ExpressResponse) {
    res.clearCookie("access_token");
    return { message: "Logged out successfully" };
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get("admin-only")
  adminOnlyRoute(@Request() req) {
    return {
      message: "This is an admin-only route",
      user: req.user,
    };
  }
}
