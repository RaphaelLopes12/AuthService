import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { TokenBlacklist } from '../auth/entities/token-blacklist.entity';
import * as bcrypt from 'bcrypt';
import { ZeroBounceService } from './zero-bounce.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(TokenBlacklist)
    private readonly tokenBlacklistRepository: Repository<TokenBlacklist>,

    private readonly zeroBounceService: ZeroBounceService,
  ) {}

  async createUser(email: string, password: string): Promise<User> {
    const isValidEmail = await this.validateEmail(email);
    if (!isValidEmail) {
      throw new ConflictException('Invalid email address');
    }
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email is already in use');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
    });
    return this.usersRepository.save(user);
  }

  async saveRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const hashedToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(userId, { refreshToken: hashedToken });
  }

  async validateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<boolean> {
    const user = await this.findById(userId);
    if (!user || !user.refreshToken) {
      return false;
    }
    return bcrypt.compare(refreshToken, user.refreshToken);
  }

  async revokeRefreshToken(refreshToken: string): Promise<void> {
    const tokenBlacklist = this.tokenBlacklistRepository.create({
      refreshToken,
    });
    await this.tokenBlacklistRepository.save(tokenBlacklist);
  }

  async isTokenRevoked(refreshToken: string): Promise<boolean> {
    const token = await this.tokenBlacklistRepository.findOne({
      where: { refreshToken },
    });
    return !!token;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(id: string, updateData: Partial<User>): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    Object.assign(user, updateData);

    return this.usersRepository.save(user);
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
    return true;
  }

  async validateEmail(email: string): Promise<boolean> {
    return this.zeroBounceService.validateEmail(email);
  }
}
