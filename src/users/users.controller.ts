import { Controller, Get } from "@nestjs/common";
import { UsersService } from "./users.service";
import { ReviewsService } from "src/reviews/reviews.service";

@Controller()
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly reviewsService: ReviewsService
    ) { }

    // GET: ~/api/users
    @Get('/api/users')
    public getAllUsers() {
        return this.usersService.getAll();
    }
}