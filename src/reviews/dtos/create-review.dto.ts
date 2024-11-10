import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, Max, Min, MinLength } from "class-validator";

export class CreateReviewDto {
    @IsNumber()
    @Min(1)
    @Max(5)
    @ApiProperty()
    rating: number;

    @IsString()
    @MinLength(2)
    @ApiProperty()
    comment: string;
}