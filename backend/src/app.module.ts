import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './categories/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true
    }),
    UsersModule,
    AuthModule,
    CategoryModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
