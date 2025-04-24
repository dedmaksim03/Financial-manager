import { BadRequestException, HttpException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { UserRequestDto } from 'src/users/dtos/user.request.dto';
import { UserResponseDto } from 'src/users/dtos/user.response.dto';
import { User } from 'src/users/user.entity';
import { log, time, timeLog } from 'console';
import { v4 as uuidv4 } from 'uuid';
import { AuthResponseDto } from './dtos/auth.response.dto';
import { create } from 'domain';
import { UpdateResult } from 'typeorm';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name)

    constructor (
        private readonly userService: UsersService,
        private readonly jwtService: JwtService
    ){}

    async registration(newUser: UserRequestDto): Promise<User> {
        this.logger.log(`jwt_secret: ${process.env.JWT_SECRET}`)
        return this.userService.createNewUser(newUser)
    }

    async validatePassword(loginUser: UserRequestDto): Promise<User | null>{
        this.logger.log(`validatePassword ${loginUser.username}, ${loginUser.password}`)
        const databaseUser = await this.userService.findUserByUsername(loginUser.username)
        if (!databaseUser) {
            this.logger.log(`Not found, databaseUser: ${databaseUser}`)
            return null
        }
        else if (await bcrypt.compare(loginUser.password, databaseUser.password)) {
            return databaseUser
        }
        else {
            this.logger.log(`Incorrect password, databaseUser: ${databaseUser}`)
            return null
        }
    }

    async login(user: UserRequestDto): Promise<AuthResponseDto | null> {
        const validUser = await this.validatePassword(user)
        if (!validUser) {
            this.logger.error(`Incorrect username or password of user ${user.username}`)
            return null
        }

        const jwtToken = this.createAccessToken(validUser)
        const refreshToken = this.createRefreshToken()

        const resultUpdateToken = this.updateRefreshToken(validUser, refreshToken)
        
        if (!resultUpdateToken){
            return null
        }
        return new AuthResponseDto(jwtToken, refreshToken)
    }

    async updateToken(refreshToken: string): Promise<{accessToken:String, refreshToken:String}> {
        const foundUser = await this.userService.findUserByToken(refreshToken)
        if (!foundUser){
            return {accessToken: "", refreshToken: ""}
        }

        this.logger.log(`found user, token expires at ${foundUser.expires}`)

        if (foundUser.expires < new Date()) {
            this.logger.log(`found user's refresh token expired`)
            return {accessToken: "", refreshToken: ""}
        }

        const newRefreshToken = this.createRefreshToken()
        const newAccessToken = this.createAccessToken(foundUser)

        const resultUpdateToken = this.updateRefreshToken(foundUser, newRefreshToken)
        
        if (!resultUpdateToken){
            return {accessToken: "", refreshToken: ""}
        }

        return {accessToken: newAccessToken, refreshToken: newRefreshToken}
    }

    private createRefreshToken(): string{
        return uuidv4()
    }

    private createAccessToken(user: User): string {
        const payload = {
            username: user.username,
            sub: user.id
        }
        return this.jwtService.sign(payload)
    }

    private async updateRefreshToken(user: User, refreshToken: string): Promise<UpdateResult | null> {
        const resultUpdateToken = await this.userService.updateRefreshToken(
            user.id, 
            refreshToken
        )

        if (!resultUpdateToken) {
            this.logger.error(`Error update refresh_token of user ${user.username}`)
            return null
        }

        this.logger.log(`Refresh token ${refreshToken} updated for user ${user.id}`)

        return resultUpdateToken
    }
}
