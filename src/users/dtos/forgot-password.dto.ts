import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MaxLength } from "class-validator";

export class ForgotPasswordDto {
    @IsEmail()
    @MaxLength(250)
    @IsNotEmpty()
    @ApiProperty()
    email: string;
}