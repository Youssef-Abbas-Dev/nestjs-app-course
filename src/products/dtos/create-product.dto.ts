import { IsString, IsNumber, IsNotEmpty, Min, Length, MinLength } from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    @Length(2, 150)
    title: string;

    @IsString()
    @MinLength(5)
    description: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(0, { message: 'price should not be less than zero' })
    price: number;
}