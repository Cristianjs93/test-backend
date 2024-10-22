import * as bcrypt from 'bcryptjs';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthResponseDto } from '@infra/dto/auth.dto';
import { User } from '@domain/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { handleErrorResponse } from '@utils/handleErrorResponse';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({
        where: { email },
        select: ['id', 'name', 'email', 'password', 'role'],
      });
      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }
      return user;
    } catch (error) {
      handleErrorResponse(error, 'Error finding user');
    }
  }

  async validateUser(email: string, pass: string): Promise<User | null> {
    try {
      const user = await this.findByEmail(email);
      if (user && (await bcrypt.compare(pass, user.password))) {
        const payload = user;
        delete payload.password;
        return payload;
      } else {
        throw new UnauthorizedException('Invalid credentials');
      }
    } catch (error) {
      handleErrorResponse(error, 'Invalid credentials');
    }
  }

  async login(user: Partial<User>): Promise<AuthResponseDto> {
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
