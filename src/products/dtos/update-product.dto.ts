import { IsString, IsNumber, IsNotEmpty, Min, Length, IsOptional, MinLength } from 'class-validator';

export class UpdateProductDto {
    @IsString()
    @IsNotEmpty()
    @Length(2, 150)
    @IsOptional()
    title?: string;

    @IsString()
    @MinLength(5)
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(0, { message: 'price should not be less than zero' })
    @IsOptional()
    price?: number;
}