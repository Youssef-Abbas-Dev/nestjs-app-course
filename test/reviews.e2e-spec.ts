import { Test, TestingModule } from "@nestjs/testing";
import { DataSource } from "typeorm";
import { INestApplication } from "@nestjs/common";
import * as request from 'supertest';
import { AppModule } from "../src/app.module";
import { Product } from "../src/products/product.entity";
import { User } from "../src/users/user.entity";
import { UserType } from "../src/utils/enums";
import * as bcrypt from 'bcryptjs';
import { CreateReviewDto } from "../src/reviews/dtos/create-review.dto";
import { Review } from "../src/reviews/review.entity";

describe('ReviewsController (e2e)', () => {
    let app: INestApplication;
    let dataSource: DataSource;
    let createReviewDto: CreateReviewDto;
    let accessToken: string;

    beforeEach(async () => {
        createReviewDto = { comment: 'Thanks', rating: 4 };

        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = module.createNestApplication();
        await app.init();
        dataSource = app.get(DataSource);

        // saving a new user (admin) to the database
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash("123456", salt)
        await dataSource.createQueryBuilder().insert().into(User).values([
            { username: 'admin', email: 'admin@email.com', userType: UserType.ADMIN, password: hash, isAccountVerified: true }
        ]).execute();

        // login to admin account and get the token
        const { body } = await request(app.getHttpServer())
            .post("/api/users/auth/login")
            .send({ email: 'admin@email.com', password: '123456' });
        accessToken = body.accessToken;
    });

    afterEach(async () => {
        await dataSource.createQueryBuilder().delete().from(Review).execute();
        await dataSource.createQueryBuilder().delete().from(Product).execute();
        await dataSource.createQueryBuilder().delete().from(User).execute();
        await app.close();
    });

    // POST: ~/api/reviews/:productId
    describe('POST', () => {
        it("should create a new review and save it to the database", async () => {
            const { body } = await request(app.getHttpServer())
                .post("/api/products")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ title: 'book', description: 'about this book', price: 10 });

            const response = await request(app.getHttpServer())
                .post(`/api/reviews/${body.id}`)
                .set("Authorization", `Bearer ${accessToken}`)
                .send(createReviewDto)

            expect(response.status).toBe(201);
            expect(response.body.id).toBeDefined();
            expect(response.body).toMatchObject(createReviewDto);
        })
    });
});