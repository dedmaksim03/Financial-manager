import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from './user.entity';
import { UserRequestDto } from './dtos/user.request.dto';
import * as bcrypt from 'bcryptjs';
import { UserResponseDto } from './dtos/user.response.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name)
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private configService: ConfigService
    ) {}

    async getAllUsers(): Promise<User[]> {
        return this.userRepository.find()
    }

    async createNewUser(newUser: UserRequestDto): Promise<User> {
        const hashedPassword = await this.hashPassword(newUser.password)
        const userForSave = new UserRequestDto(newUser.username, hashedPassword)
        let createdUser: User = await this.userRepository.save(userForSave)
        return createdUser
    }

    async findUserByUsername(username: string): Promise<User | null>{
        return this.userRepository.findOneBy({username: username})
    }

    async findUserById(id: number){
        return this.userRepository.findOne({where: {id}})
    }

    async findUserByToken(refreshToken: string): Promise<User | null> {
        return await this.userRepository.findOne({where: {refresh_token: refreshToken}})
    }

    async updateRefreshToken(userId: number, refresh_token: string): Promise<UpdateResult> {
        const expires = Number(this.configService.get<number>('REFRESH_EXPIRES')) || 1
        let expiresDate = new Date()
        expiresDate.setDate(expiresDate.getDate() + expires)
        this.logger.log(`Expires: ${expires}`)
        this.logger.log(`Setting expire date: ${expiresDate}, now date: ${new Date()}`)
        return this.userRepository.update(userId, {refresh_token: refresh_token, expires: expiresDate})
    }

    private async hashPassword(password: string): Promise<string>{
        const salt = await bcrypt.genSalt()
        return await bcrypt.hash(password, salt)
    }

}
