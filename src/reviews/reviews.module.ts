import { Module } from "@nestjs/common";
import { ReviewsController } from "./reviews.controller";
import { ReviewsService } from "./reviews.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Review } from "./review.entity";
import { ProductsModule } from "../products/products.module";
import { UsersModule } from "../users/users.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
    controllers: [ReviewsController],
    providers: [ReviewsService],
    imports: [TypeOrmModule.forFeature([Review]), ProductsModule, UsersModule, JwtModule]
})
export class ReviewsModule {}