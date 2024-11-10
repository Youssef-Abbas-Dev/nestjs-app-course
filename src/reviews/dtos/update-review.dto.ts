import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, Max, Min, MinLength } from "class-validator";

export class UpdateReviewDto {
    @IsNumber()
    @Min(1)
    @Max(5)
    @IsOptional()
    @ApiPropertyOptional()
    rating?: number;

    @IsString()
    @MinLength(2)
    @IsOptional()
    @ApiPropertyOptional()
    comment?: string;
}