import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UserRequestDto } from './dtos/user.request.dto';
import { create } from 'domain';
import { UserResponseDto } from './dtos/user.response.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    async getAllUsers(): Promise<User[]> {
        return this.usersService.getAllUsers()
    }

    // @Post('create')
    // createNewUser(@Body() newUser: UserRequestDto): Promise<UserResponseDto> {
    //     return this.usersService.createNewUser(newUser)
    // }
}
