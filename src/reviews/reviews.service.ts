import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { UsersService } from "src/users/users.service";

@Injectable()
export class ReviewsService {
    constructor(
        @Inject(forwardRef(() => UsersService)) 
        private readonly usersService: UsersService
    ) { }

    public getAll() {
        return [
            { id: 1, rating: 4, comment: 'good' },
            { id: 2, rating: 5, comment: 'very good' }
        ]
    }
}