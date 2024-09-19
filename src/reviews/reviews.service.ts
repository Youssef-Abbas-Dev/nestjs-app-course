import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Review } from "./review.entity";
import { Repository } from "typeorm";
import { ProductsService } from "src/products/products.service";
import { UsersService } from "src/users/users.service";
import { CreateReviewDto } from "./dtos/create-review.dto";

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Review) private readonly reviewsRepository: Repository<Review>,
        private readonly productsService: ProductsService,
        private readonly usersService: UsersService
    ) { }

    /**
     * Create new review
     * @param productId id of the product
     * @param userId id of the user that created this review
     * @param dto data for creating new review
     * @returns the created review from the database
     */
    public async createReview(productId:number, userId: number, dto: CreateReviewDto) {
        const product = await this.productsService.getOneBy(productId);
        const user = await this.usersService.getCurrentUser(userId);

        const review = this.reviewsRepository.create({ ...dto, user, product });
        const result = await this.reviewsRepository.save(review);

        return {
            id: result.id,
            comment: result.comment,
            rating: result.rating,
            createdAt: result.createdAt,
            userId: user.id,
            productId: product.id
        }
    }

    // Get all reviews
    // Update reviews
    // Delete reviews
    // Get single review by id
}