import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { TokenBlacklist } from '../auth/entities/token-blacklist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, TokenBlacklist])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
