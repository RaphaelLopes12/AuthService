import 'dotenv/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { Address } from './addresses/entities/address.entity';
import { TokenBlacklist } from './auth/entities/token-blacklist.entity';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, TokenBlacklist, Address],
      synchronize: true,
      logging: true,
    }),
    AuthModule,
    UsersModule,
    HealthModule,
  ],
})
export class AppModule {}
