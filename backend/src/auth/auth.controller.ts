import { Body, Controller, Get, HttpException, InternalServerErrorException, Logger, Post, Req, Res, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Response, Request as R} from 'express';
import { UserRequestDto } from 'src/users/dtos/user.request.dto';
import { UserResponseDto } from 'src/users/dtos/user.response.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from 'src/jwt/jwt.auth.guard';
import { AuthResponseDto } from './dtos/auth.response.dto';

@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name)

    constructor(private readonly authService: AuthService) {}

    @Post('registration')
    async registration(@Body() newUser: UserRequestDto, @Res() res: Response){
        const createdUser = await this.authService.registration(newUser)

        if (!createdUser) {
            this.logger.error(`Registration error ${createdUser}`)
            return new InternalServerErrorException(`Registration error`)
        }

        this.logger.log(`New user created: ${createdUser.id}, ${createdUser.username}`)

        const authResponseDto: AuthResponseDto | null = await this.authService.login(newUser)
        if (!authResponseDto){
            return new UnauthorizedException('Incorrect username or password')
        }
        res.cookie(
            'refresh_token', authResponseDto.refresh_token, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict'
            }
        )

        return res.status(200).json({"access_token": authResponseDto.token})  
    }

    @Get('token')
    async update_token(@Req() req: R, @Res() res: Response) {
        if (!req.cookies?.refresh_token) {
            return res.status(403).json({"msg": "No refresh token"})//new UnauthorizedException("No refresh token")
        }
        const {accessToken, refreshToken} = await this.authService.updateToken(req.cookies.refresh_token)
        if (!accessToken || !refreshToken){
            return res.status(403).json({"msg": "Invalid refresh token"})
        }

        res.cookie(
            'refresh_token', refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict'
            }
        )

        return res.status(200).json({"access_token": accessToken})  
    }

    @Post('login')
    async login(@Body() loginUser: UserRequestDto, @Res() res: Response) {
        const authResponseDto: AuthResponseDto | null = await this.authService.login(loginUser)
        if (!authResponseDto){
            return res.status(403).json({"msg":'Incorrect username or password'})
        }
        res.cookie(
            'refresh_token', authResponseDto.refresh_token, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict'
            }
        )

        return res.status(200).json({"access_token": authResponseDto.token})
    }

    @UseGuards(JwtAuthGuard)
    @Get('check_token')
    async checkToken(@Request() req) {
        return req.user
    }

    @Post('logout')
    logout(@Body() newUser: UserRequestDto): Promise<UserResponseDto> {
        return this.authService.registration(newUser)
    }
}
