import { Controller, Get } from "@nestjs/common";
import { ReviewsService } from "./reviews.service";
import { UsersService } from "src/users/users.service";

@Controller()
export class ReviewsController {

    constructor(
        private readonly reviewsService: ReviewsService,
        private readonly usersService: UsersService
    ) {}

    // GET: ~/api/reviews
    @Get('/api/reviews')
    public getAllReviews() {
        return this.reviewsService.getAll();
    }
}