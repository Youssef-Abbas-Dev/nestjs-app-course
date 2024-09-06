import { Module } from "@nestjs/common";
import { ReviewsController } from "./reviews.controller";
import { ReviewsService } from "./reviews.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Review } from "./review.entity";

@Module({
    controllers: [ReviewsController],
    providers: [ReviewsService],
    imports: [TypeOrmModule.forFeature([Review])]
})
export class ReviewsModule {}