import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { DatabaseModule } from 'src/database/database.module';

@Module({
    imports: [
      DatabaseModule
    ],
    controllers: [UsersController],
    providers: [UsersService]
})
export class UsersModule {}
