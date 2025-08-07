import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { RegisterDto } from 'src/users/dto/register.dto';
import { User } from 'src/users/schemas/user.schemas';
import { LoginDto } from 'src/users/dto/login.dto';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ access_token: string; user: User }> {
    const user = await this.usersService.create(registerDto);
    const payload: JwtPayload = {
      sub: user._id.toString(),
      phoneNumber: user.phoneNumber,
      role: user.role,
      name: user.name,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string; user: User }> {
    const user = await this.usersService.findByPhoneNumber(loginDto.phoneNumber);
    
    const isPasswordValid = await this.usersService.validatePassword(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive');
    }

    const payload: JwtPayload = {
      sub: user._id.toString(),
      phoneNumber: user.phoneNumber,
      role: user.role,
      name: user.name,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}