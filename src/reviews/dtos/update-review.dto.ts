import { IsNumber, IsOptional, IsString, Max, Min, MinLength } from "class-validator";

export class UpdateReviewDto {
    @IsNumber()
    @Min(1)
    @Max(5)
    @IsOptional()
    rating?: number;

    @IsString()
    @MinLength(2)
    @IsOptional()
    comment?: string;
}