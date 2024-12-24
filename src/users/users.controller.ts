import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Put,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
    Res
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { RegisterDto } from "./dtos/register.dto";
import { LoginDto } from "./dtos/login.dto";
import { AuthGuard } from "./guards/auth.guard";
import { AuthRolesGuard } from "./guards/auth-roles.guard";
import { CurrentUser } from "./decorators/current-user.decorator";
import { JWTPayloadType } from "../utils/types";
import { Roles } from "./decorators/user-role.decorator";
import { UserType } from "../utils/enums"
import { UpdateUserDto } from "./dtos/update-user.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express, Response } from "express";
import { ForgotPasswordDto } from "./dtos/forgot-password.dto";
import { ResetPasswordDto } from "./dtos/reset-password.dto";
import { ApiSecurity, ApiConsumes, ApiBody } from "@nestjs/swagger";
import { ImageUploadDto } from "./dtos/image-upload.dto";

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
    @ApiSecurity('bearer')
    public getCurrentUser(@CurrentUser() payload: JWTPayloadType) {
        return this.usersService.getCurrentUser(payload.id);
    }

    // GET: ~/api/users
    @Get()
    @Roles(UserType.ADMIN)
    @UseGuards(AuthRolesGuard)
    @ApiSecurity('bearer')
    public getAllUsers() {
        return this.usersService.getAll();
    }

    // PUT: ~/api/users
    @Put()
    @Roles(UserType.ADMIN, UserType.NORMAL_USER)
    @UseGuards(AuthRolesGuard)
    @ApiSecurity('bearer')
    public updateUser(@CurrentUser() payload: JWTPayloadType, @Body() body: UpdateUserDto) {
        return this.usersService.update(payload.id, body);
    }

    // DELETE: ~/api/users/:id
    @Delete(":id")
    @Roles(UserType.ADMIN, UserType.NORMAL_USER)
    @UseGuards(AuthRolesGuard)
    @ApiSecurity('bearer')
    public deleteUser(@Param("id", ParseIntPipe) id: number, @CurrentUser() payload: JWTPayloadType) {
        return this.usersService.delete(id, payload);
    }

    // POST: ~/api/users/upload-image
    @Post('upload-image')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('user-image'))
    @ApiSecurity('bearer')
    @ApiConsumes("multipart/form-data")
    @ApiBody({ type: ImageUploadDto, description: 'profile image' })
    public uploadProfileImage(
        @UploadedFile() file: Express.Multer.File,
        @CurrentUser() payload: JWTPayloadType) {
        if (!file) throw new BadRequestException("no image provided");
        return this.usersService.setProfileImage(payload.id, file.filename);
    }

    // DELETE: ~/api/users/images/remove-profile-image
    @Delete("images/remove-profile-image")
    @UseGuards(AuthGuard)
    @ApiSecurity('bearer')
    public removeProfileImage(@CurrentUser() payload: JWTPayloadType) {
        return this.usersService.removeProfileImage(payload.id);
    }

    // GET: ~/api/users/images/:image
    @Get("images/:image")
    @UseGuards(AuthGuard)
    @ApiSecurity('bearer')
    public showProfileImage(@Param('image') image: string, @Res() res: Response) {
        return res.sendFile(image, { root: 'images/users' })
    }

    // GET: ~/api/users/verify-email/:id/:verificationToken
    @Get("verify-email/:id/:verificationToken")
    public verifyEmail(
        @Param('id', ParseIntPipe) id: number,
        @Param('verificationToken') verificationToken: string
    ) {
        return this.usersService.verifyEmail(id, verificationToken);
    }

    // POST: ~/api/users/forgot-password
    @Post("forgot-password")
    @HttpCode(HttpStatus.OK)
    public forgotPassword(@Body() body: ForgotPasswordDto) {
        return this.usersService.sendResetPassword(body.email);
    }

    // GET: ~/api/users/reset-password/:id/:resetPasswordToken
    @Get("reset-password/:id/:resetPasswordToken")
    public getResetPassword(
        @Param("id", ParseIntPipe) id: number,
        @Param("resetPasswordToken") resetPasswordToken: string
    ) {
        return this.usersService.getResetPassword(id, resetPasswordToken);
    }

    // POST: ~/api/users/reset-password
    @Post("reset-password")
    public resetPassword(@Body() body: ResetPasswordDto) {
        return this.usersService.resetPassword(body);
    }
}