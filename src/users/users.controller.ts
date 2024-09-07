import { Body, Controller, Get, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import { RegisterDto } from "./dtos/register.dto";
import { LoginDto } from "./dtos/login.dto";

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
}