import { Controller, Get } from "@nestjs/common";
import { ReviewsService } from "./reviews.service";

@Controller()
export class ReviewsController {

    constructor(
        private readonly reviewsService: ReviewsService,
    ) {}

    // GET: ~/api/reviews
    @Get('/api/reviews')
    public getAllReviews() {
        return this.reviewsService.getAll();
    }
}