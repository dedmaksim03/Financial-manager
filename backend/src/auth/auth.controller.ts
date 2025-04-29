import { Body, Controller, Get, HttpException, InternalServerErrorException, Logger, Post, Req, Res, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Response, Request as R } from 'express'
import { UserRequestDto } from 'src/users/dtos/user.request.dto'
import { UserResponseDto } from 'src/users/dtos/user.response.dto'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from 'src/jwt/jwt.auth.guard'
import { AuthResponseDto } from './dtos/auth.response.dto'

@Controller('api/auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name)

    constructor(private readonly authService: AuthService) {}

    @Post('registration')
    async registration(@Body() newUser: UserRequestDto, @Res() res: Response){
        if (!newUser.password || !newUser.username) {
            this.logger.error(`User has not password or username ${newUser.username} ${newUser.password}`)
            return res.status(400).json({"msg": "Incorrect username or password"})
        }
        const createdUser = await this.authService.registration(newUser)

        if (!createdUser) {
            this.logger.error(`Registration error ${createdUser}`)
            return res.status(400).json({"msg": "Registration error"})
        }

        this.logger.log(`New user created: ${createdUser.id}, ${createdUser.username}`)

        const authResponseDto: AuthResponseDto | null = await this.authService.login(newUser)
        if (!authResponseDto){
            return res.status(400).json({"msg": "Incorrect username or password"})
            
        }
        res.cookie(
            'refresh_token', authResponseDto.refresh_token, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict'
            }
        )

        return res.status(200).json({
            "access_token": authResponseDto.token,
            "username" : newUser.username 
        })  
    }

    @Post('refresh')
    async update_token(@Req() req: R, @Res() res: Response) {
        if (!req.cookies?.refresh_token) {
            return res.status(401).json({"msg": "No refresh token"})//new UnauthorizedException("No refresh token")
        }
        const {accessToken, refreshToken, username} = await this.authService.updateToken(req.cookies.refresh_token)
        if (!accessToken || !refreshToken){
            return res.status(401).json({"msg": "Invalid refresh token"})
        }

        res.cookie(
            'refresh_token', refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict'
            }
        )

        return res.status(200).json({
            "access_token": accessToken,
            "username": username
        })  
    }

    @Post('login')
    async login(@Body() loginUser: UserRequestDto, @Res() res: Response) {
        if (!loginUser.password || !loginUser.username) {
            this.logger.error(`User has not password or username ${loginUser.toString()}`)
            return res.status(400).json({"msg":'Incorrect username or password'})
        }
        const authResponseDto: AuthResponseDto | null = await this.authService.login(loginUser)
        if (!authResponseDto){
            return res.status(401).json({"msg":'Incorrect username or password'})
        }
        res.cookie(
            'refresh_token', authResponseDto.refresh_token, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict'
            }
        )

        return res.status(200).json({
            "access_token": authResponseDto.token, 
            "username" : loginUser.username 
        })
    }

    @UseGuards(JwtAuthGuard)
    @Get('check_token')
    async checkToken(@Request() req) {
        return req.user
    }

    @Post('logout')
    async logout(@Req() req: R, @Res() res: Response): Promise<Response> {
        if (!req.cookies?.refresh_token) {
            return res.status(401).json({"msg":'No refresh token'})
        }
        const resultLogout = await this.authService.logout(req.cookies.refresh_token)

        if (!resultLogout) {
            return res.status(401).json({"msg":'Invalid refresh token'})
        }

        res.cookie(
            'refresh_token', ''
        )

        return res.status(200).json({})
    }
    
}
