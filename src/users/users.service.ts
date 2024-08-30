import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { ReviewsService } from "src/reviews/reviews.service";

@Injectable()
export class UsersService {
    constructor(
        @Inject(forwardRef(() => ReviewsService))
        private readonly reviewsService: ReviewsService
    ) {}

    public getAll() {
        return [
            { id: 1, email: 'ahmed@email.com' },
            { id: 2, email: 'youssef@email.com' }
        ]
    }
}