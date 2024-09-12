import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { RegisterDto } from "./dtos/register.dto";
import { LoginDto } from "./dtos/login.dto";
import { AuthGuard } from "./guards/auth.guard";
import { AuthRolesGuard } from "./guards/auth-roles.guard";
import { CurrentUser } from "./decorators/current-user.decorator";
import { JWTPayloadType } from "src/utils/types";
import { Roles } from "./decorators/user-role.decorator";
import { UserType } from "../utils/enums"

@Controller("api/users")
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) { }

    // POST: ~/api/users/auth/register
    @Post("auth/register")
    public register(@Body() body: RegisterDto) {
        return this.usersService.register(body);
    }

    // POST: ~/api/users/auth/login
    @Post("auth/login")
    @HttpCode(HttpStatus.OK)
    public login(@Body() body: LoginDto) {
        return this.usersService.login(body);
    }

    // GET: ~/api/users/current-user
    @Get("current-user")
    @UseGuards(AuthGuard)
    public getCurrentUser(@CurrentUser() payload: JWTPayloadType) {
        return this.usersService.getCurrentUser(payload.id);
    }

    // GET: ~/api/users
    @Get()
    @Roles(UserType.ADMIN)
    @UseGuards(AuthRolesGuard)
    public getAllUsers() {
        return this.usersService.getAll();
    }
}