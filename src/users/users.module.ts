import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ZeroBounceService } from './zero-bounce.service';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Address } from 'src/addresses/entities/address.entity';
import { TokenBlacklist } from '../auth/entities/token-blacklist.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, TokenBlacklist, Address]),
    HttpModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  providers: [UsersService, ZeroBounceService],
  exports: [UsersService, ZeroBounceService],
})
export class UsersModule {}
