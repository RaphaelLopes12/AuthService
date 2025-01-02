import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { BadRequestException } from '@nestjs/common';
import { parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  private parseBirthDate(birthDate: string): Date {
    const parsedDate = parse(birthDate, 'dd/MM/yyyy', new Date(), {
      locale: ptBR,
    });
    if (isNaN(parsedDate.getTime())) {
      throw new BadRequestException('Invalid birth date format.');
    }

    return new Date(
      parsedDate.getFullYear(),
      parsedDate.getMonth(),
      parsedDate.getDate(),
    );
  }

  @Post('register')
  async register(
    @Body()
    body: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      confirmPassword: string;
      birthDate: string;
      phoneNumber: string;
      cpfOrCnpj: string;
      address: {
        postalCode: string;
        street: string;
        number: string;
        complement?: string;
        neighborhood: string;
        city: string;
        state: string;
      };
    },
  ) {
    if (body.password !== body.confirmPassword) {
      throw new BadRequestException('Passwords do not match.');
    }

    // const isValidEmail = await this.usersService.validateEmail(body.email);
    // if (!isValidEmail) {
    //   throw new BadRequestException('Invalid email address.');
    // }

    const isValidCpfOrCnpj = await this.usersService.validateCpfOrCnpj(
      body.cpfOrCnpj,
    );
    if (!isValidCpfOrCnpj) {
      throw new BadRequestException('Invalid CPF or CNPJ.');
    }

    const birthDate = this.parseBirthDate(body.birthDate);

    const user = await this.usersService.createUser(
      {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: body.password,
        birthDate,
        phoneNumber: body.phoneNumber,
        cpfOrCnpj: body.cpfOrCnpj,
      },
      body.address,
    );

    return { userId: user.id, message: 'User registered successfully' };
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    return this.authService.login(user);
  }

  @Post('refresh-token')
  async refreshToken(@Body() body: { userId: string; refreshToken: string }) {
    return this.authService.refreshToken(body.userId, body.refreshToken);
  }

  @Post('logout')
  async logout(@Body() body: { refreshToken: string }) {
    await this.authService.logout(body.refreshToken);
    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
