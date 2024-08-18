import { Controller, Get } from "@nestjs/common";

@Controller()
export class ReviewsController {

    // GET: ~/api/reviews
    @Get('/api/reviews')
    public getAllReviews() {
        return [
            { id: 1, rating: 4, comment: 'good' },
            { id: 2, rating: 5, comment: 'very good' }
        ]
    }
}