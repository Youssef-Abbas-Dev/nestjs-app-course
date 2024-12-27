import { Test, TestingModule } from "@nestjs/testing";
import { DataSource } from "typeorm";
import { INestApplication } from "@nestjs/common";
import * as request from 'supertest';
import { AppModule } from "../src/app.module";
import { Product } from "../src/products/product.entity";
import { User } from "../src/users/user.entity";
import { CreateProductDto } from "../src/products/dtos/create-product.dto";
import { UserType } from "../src/utils/enums";
import * as bcrypt from 'bcryptjs';

describe('ProductsController (e2e)', () => {
    let app: INestApplication;
    let dataSource: DataSource;
    let productsToSave: CreateProductDto[];
    let accessToken: string;
    let dto: CreateProductDto;

    beforeEach(async () => {
        dto = { title: 'book', description: 'about this book', price: 10 };

        productsToSave = [
            { title: 'book', description: 'about this book', price: 10 },
            { title: 'laptop', description: 'about this laptop', price: 400 },
            { title: 'carpet', description: 'about this carpet', price: 70 },
            { title: 'chair', description: 'about this chair', price: 21 }
        ];

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
        await dataSource.createQueryBuilder().delete().from(Product).execute();
        await dataSource.createQueryBuilder().delete().from(User).execute();
        await app.close();
    });

    // POST: ~/api/products
    describe('POST', () => {
        it("should create a new product and save it to the database", async () => {
            const response = await request(app.getHttpServer())
                .post("/api/products")
                .set("Authorization", `Bearer ${accessToken}`)
                .send(dto);

            expect(response.status).toBe(201);
            expect(response.body.id).toBeDefined();
            expect(response.body).toMatchObject(dto);
        });

        it("should return 400 status code if title was less than 2 characters", async () => {
            dto.title = "b";
            const response = await request(app.getHttpServer())
                .post("/api/products")
                .set("Authorization", `Bearer ${accessToken}`)
                .send(dto);

            expect(response.status).toBe(400);
        });

        it("should return 400 status code if price was less than zero", async () => {
            dto.price = -1;
            const response = await request(app.getHttpServer())
                .post("/api/products")
                .set("Authorization", `Bearer ${accessToken}`)
                .send(dto);

            expect(response.status).toBe(400);
        });

        it("should return 401 status code if bearer token was not provided", async () => {
            const response = await request(app.getHttpServer())
                .post("/api/products")
                .send(dto);

            expect(response.status).toBe(401);
        });
    });

    // GET: ~/api/products
    describe('GET', () => {
        beforeEach(async () => {
            await dataSource.createQueryBuilder().insert().into(Product).values(productsToSave).execute();
        });

        it("should return all products from the database", async () => {
            const response = await request(app.getHttpServer()).get("/api/products");
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(4);
        });

        it("should return products based on title", async () => {
            const response = await request(app.getHttpServer()).get("/api/products?title=laptop");
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(1);
        });

        it("should return products based on minPrice & maxPrice", async () => {
            const response = await request(app.getHttpServer()).get("/api/products?minPrice=20&maxPrice=100");
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(2);
        });
    });

    // GET: ~/api/products/:id
    describe('GET /:id', () => {
        it("should return a product with the givin id", async () => {
            const { body } = await request(app.getHttpServer())
                .post("/api/products")
                .set("Authorization", `Bearer ${accessToken}`)
                .send(dto);

            const response = await request(app.getHttpServer()).get(`/api/products/${body.id}`);
            expect(response.status).toBe(200);
            expect(response.body.id).toBe(body.id);
            expect(response.body).toMatchObject(dto);
        });

        it("should return 404 status code if product was not found", async () => {
            const response = await request(app.getHttpServer()).get(`/api/products/1`);
            expect(response.status).toBe(404);
        });

        it("should return 400 status code if invald id passed", async () => {
            const response = await request(app.getHttpServer()).get(`/api/products/abc`);
            expect(response.status).toBe(400);
        });
    });

    // PUT: ~/api/products/:id
    describe('PUT /:id', () => {
        it("should update the product", async () => {
            const { body } = await request(app.getHttpServer())
                .post("/api/products")
                .set("Authorization", `Bearer ${accessToken}`)
                .send(dto);

            const response = await request(app.getHttpServer())
                .put(`/api/products/${body.id}`)
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ title: "updated" });
            expect(response.status).toBe(200);
            expect(response.body.title).toBe("updated");
        });

        it("should return 400 status code if title was less than 2 characters", async () => {
            const { body } = await request(app.getHttpServer())
                .post("/api/products")
                .set("Authorization", `Bearer ${accessToken}`)
                .send(dto);

            const response = await request(app.getHttpServer())
                .put(`/api/products/${body.id}`)
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ title: "u" });

            expect(response.status).toBe(400);
        });

        it("should return 404 status code if product was not found", async () => {
            const response = await request(app.getHttpServer())
                .put(`/api/products/1`)
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ title: "updated" });

            expect(response.status).toBe(404);
            expect(response.body).toMatchObject({ message: 'product not found' });
        });

        it("should return 400 status code if invalid id passed", async () => {
            const response = await request(app.getHttpServer())
                .put(`/api/products/abc`)
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ title: "updated" });

            expect(response.status).toBe(400);
        });
    });

    // DELETE: ~/api/products/:id
    describe('DELETE /:id', () => {
        it("should delete the product with the givin id", async () => {
            const { body } = await request(app.getHttpServer())
                .post("/api/products")
                .set("Authorization", `Bearer ${accessToken}`)
                .send(dto);

            const response = await request(app.getHttpServer())
                .delete(`/api/products/${body.id}`)
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({ message: 'product deleted successfully' })
        });

        it("should return 401 status code if no token provided", async () => {
            const response = await request(app.getHttpServer())
                .delete(`/api/products/1`)

            expect(response.status).toBe(401);
        });

        it("should return 404 status code if product was not found", async () => {
            const response = await request(app.getHttpServer())
                .delete(`/api/products/1`)
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(404);
            expect(response.body).toMatchObject({ message: 'product not found' });
        });

        it("should return 400 status code if invalid id passed", async () => {
            const response = await request(app.getHttpServer())
                .delete(`/api/products/abc`)
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(400);
        });
    });
});