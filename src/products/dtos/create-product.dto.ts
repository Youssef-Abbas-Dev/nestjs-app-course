import { IsString, IsNumber, IsNotEmpty, Min, Length, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    @Length(2, 150)
    @ApiProperty({ description: 'title of the product' })
    title: string;

    @IsString()
    @MinLength(5)
    @ApiProperty({ description: 'description of the product' })
    description: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(0, { message: 'price should not be less than zero' })
    @ApiProperty({ description: 'price of the product' })
    price: number;
}