import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { CURRENT_USER_KEY } from "../../utils/constants";
import { JWTPayloadType } from "../../utils/types";
import { Reflector } from "@nestjs/core";
import { UserType } from "../../utils/enums";
import { UsersService } from "../users.service";


@Injectable()
export class AuthRolesGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly reflector: Reflector,
        private readonly usersService: UsersService
    ) { }

    async canActivate(context: ExecutionContext) {
        const roles: UserType[] = this.reflector.getAllAndOverride('roles',
            [context.getHandler(), context.getClass()]);
        
        if(!roles || roles.length === 0) return false;

        const request: Request = context.switchToHttp().getRequest();
        const [type, token] = request.headers.authorization?.split(" ") ?? [];
        if (token && type === "Bearer") {
            try {
                const payload: JWTPayloadType = await this.jwtService.verifyAsync(
                    token,
                    {
                        secret: this.configService.get<string>("JWT_SECRET")
                    }
                );

                const user = await this.usersService.getCurrentUser(payload.id);
                if(!user) return false;

                if(roles.includes(user.userType)) {
                    request[CURRENT_USER_KEY] = payload;
                    return true;
                }
            } catch (error) {
                throw new UnauthorizedException("access denied, invalid token");
            }
        } else {
            throw new UnauthorizedException("access denied, no token provided");
        }

        return false;
    }
}