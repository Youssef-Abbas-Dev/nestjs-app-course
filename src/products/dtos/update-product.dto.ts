import { IsString, IsNumber, IsNotEmpty, Min, Length, IsOptional, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductDto {
    @IsString()
    @IsNotEmpty()
    @Length(2, 150)
    @IsOptional()
    @ApiPropertyOptional()
    title?: string;

    @IsString()
    @MinLength(5)
    @IsOptional()
    @ApiPropertyOptional()
    description?: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(0, { message: 'price should not be less than zero' })
    @IsOptional()
    @ApiPropertyOptional()
    price?: number;
}