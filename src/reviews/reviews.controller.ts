import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards, Put, Delete, Query } from "@nestjs/common";
import { ReviewsService } from "./reviews.service";
import { CurrentUser } from "../users/decorators/current-user.decorator";
import { Roles } from "../users/decorators/user-role.decorator";
import { AuthRolesGuard } from "src/users/guards/auth-roles.guard";
import { CreateReviewDto } from "./dtos/create-review.dto";
import { JWTPayloadType } from "src/utils/types";
import { UserType } from "src/utils/enums";
import { UpdateReviewDto } from "./dtos/update-review.dto";

@Controller('api/reviews')
export class ReviewsController {

    constructor(
        private readonly reviewsService: ReviewsService,
    ) { }

    // POST: ~/api/reviews/:productId
    @Post(':productId')
    @UseGuards(AuthRolesGuard)
    @Roles(UserType.ADMIN, UserType.NORMAL_USER)
    public createNewReview(
        @Param('productId', ParseIntPipe) productId: number,
        @Body() body: CreateReviewDto,
        @CurrentUser() payload: JWTPayloadType
    ) {
        return this.reviewsService.createReview(productId, payload.id, body);
    }

    // GET: ~/api/reviews
    @Get()
    @UseGuards(AuthRolesGuard)
    @Roles(UserType.ADMIN)
    public getAllReviews(
        @Query('pageNumber', ParseIntPipe) pageNumber:number,
        @Query('reviewPerPage', ParseIntPipe) reviewPerPage:number,
    ) {
        return this.reviewsService.getAll(pageNumber, reviewPerPage);
    }

    // PUT: ~/api/reviews/:id
    @Put(':id')
    @UseGuards(AuthRolesGuard)
    @Roles(UserType.ADMIN, UserType.NORMAL_USER)
    public updateReview(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateReviewDto,
        @CurrentUser() payload: JWTPayloadType
    ) {
        return this.reviewsService.update(id, payload.id, body);
    }

    // DELETE: ~/api/reviews/:id
    @Delete(':id')
    @UseGuards(AuthRolesGuard)
    @Roles(UserType.ADMIN, UserType.NORMAL_USER)
    public deleteReview(@Param('id', ParseIntPipe) id: number,@CurrentUser() payload: JWTPayloadType) {
        return this.reviewsService.delete(id, payload);
    }
}