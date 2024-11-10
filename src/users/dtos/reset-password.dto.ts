import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, Min, MinLength } from "class-validator";

export class ResetPasswordDto {
    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    @ApiProperty()
    newPassword: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    @ApiProperty()
    userId: number;
    
    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    @ApiProperty()
    resetPasswordToken: string;
}