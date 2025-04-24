import { Injectable, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { log } from "console";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from "src/users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    private readonly logger = new Logger(PassportStrategy.name)
    constructor (private readonly userService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: String(process.env.JWT_SECRET), // Замените на ваш секретный ключ
          });
    }

    async validate(payload: any) {
        this.logger.log(`Validating: ${payload.toISOString}`)
        return this.userService.findUserById(payload.sub);
    }
}