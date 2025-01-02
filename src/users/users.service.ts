import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Address } from '../addresses/entities/address.entity';
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

    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,

    private readonly zeroBounceService: ZeroBounceService,
  ) {}

  async createUser(
    userData: Partial<User>,
    addressData: Partial<Address>,
  ): Promise<User> {
    // const isValidEmail = await this.validateEmail(userData.email);
    // if (!isValidEmail) {
    //   throw new ConflictException('Invalid email address');
    // }

    const existingUser = await this.usersRepository.findOne({
      where: { email: userData.email },
    });
    if (existingUser) {
      throw new ConflictException('Email is already in use');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(user);

    const address = this.addressRepository.create({
      ...addressData,
      user: savedUser,
    });

    await this.addressRepository.save(address);

    return savedUser;
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

  async validateCpfOrCnpj(cpfOrCnpj: string): Promise<boolean> {
    const isCpf = cpfOrCnpj.length === 11 && /^[0-9]+$/.test(cpfOrCnpj);
    const isCnpj = cpfOrCnpj.length === 14 && /^[0-9]+$/.test(cpfOrCnpj);

    if (!isCpf && !isCnpj) {
      throw new ConflictException('Invalid CPF or CNPJ format');
    }

    const existingUser = await this.usersRepository.findOne({
      where: { cpfOrCnpj },
    });

    if (existingUser) {
      throw new ConflictException('CPF or CNPJ is already in use');
    }

    return true;
  }
}
