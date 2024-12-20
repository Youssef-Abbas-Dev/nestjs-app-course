import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Review } from "./review.entity";
import { Repository } from "typeorm";
import { ProductsService } from "../products/products.service";
import { UsersService } from "../users/users.service";
import { CreateReviewDto } from "./dtos/create-review.dto";
import { UpdateReviewDto } from "./dtos/update-review.dto";
import { JWTPayloadType } from "../utils/types";
import { UserType } from "../utils/enums";

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

    /**
     * Get all reviews
     * @param pageNumber number of the current page
     * @param reviewPerPage data per page
     * @returns collection of reviews
     */
    public async getAll(pageNumber:number, reviewPerPage: number) {
        return this.reviewsRepository.find({ 
            skip: reviewPerPage * (pageNumber - 1),
            take: reviewPerPage,
            order: { createdAt: "DESC" } 
        });
    }

    /**
     * Update reviews
     * @param reviewId id of the review 
     * @param userId id of the owner of the review
     * @param dto data for updating the review
     * @returns updated review
     */
    public async update(reviewId: number, userId:number, dto: UpdateReviewDto) {
        const review = await this.getReviewBy(reviewId);
        if(review.user.id !== userId)
            throw new ForbiddenException("access denied, you are not allowed");
        
        review.rating = dto.rating ?? review.rating;
        review.comment = dto.comment ?? review.comment;
        
        return this.reviewsRepository.save(review);
    }

    /**
     * Delete review
     * @param reviewId id of the review
     * @param payload JWTPayload
     * @returns a success message
     */
    public async delete(reviewId:number, payload: JWTPayloadType) {
        const review = await this.getReviewBy(reviewId);

        if(review.user.id === payload.id || payload.userType === UserType.ADMIN) {
            await this.reviewsRepository.remove(review);
            return { message: 'Review has been deleted' };
        }

        throw new ForbiddenException("you are not allowed");
    }

    /**
     * Get single review by id
     * @param id id of the review
     * @returns review from the database
     */
    private async getReviewBy(id: number) {
        const review = await this.reviewsRepository.findOne({ where: { id } });
        if(!review) throw new NotFoundException("review not found");
        return review;
    }
}