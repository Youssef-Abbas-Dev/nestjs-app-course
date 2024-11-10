import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, Length, MinLength } from "class-validator";

export class UpdateUserDto {
    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    @IsOptional()
    @ApiPropertyOptional()
    password?: string;

    @IsString()
    @Length(2, 150)
    @IsOptional()
    @ApiPropertyOptional()
    username?: string;
}