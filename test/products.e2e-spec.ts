import { Test, TestingModule } from "@nestjs/testing";
import { DataSource } from "typeorm";
import { INestApplication } from "@nestjs/common";
import * as request from 'supertest';
import { AppModule } from "../src/app.module";
import { Product } from "../src/products/product.entity";
import { CreateProductDto } from "../src/products/dtos/create-product.dto";

describe('ProductsController (e2e)', () => {
    let app: INestApplication;
    let dataSource: DataSource;
    let productsToSave: CreateProductDto[];

    beforeEach(async () => {
        productsToSave = [
            { title: 'book', description: 'about this book', price: 10 },
            { title: 'laptop', description: 'about this laptop', price: 400 },
            { title: 'carpet', description: 'about this carpet', price: 70 },
            { title: 'chair', description: 'about this chair', price: 21 }
        ];

        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = module.createNestApplication();
        await app.init();
        dataSource = app.get(DataSource);
    });

    afterEach(async () => {
        await dataSource.createQueryBuilder().delete().from(Product).execute();
        await app.close();
    });

    // GET: ~/api/products
    describe('GET', () => { 
        it("should return all products from the database", async () => {
          await dataSource.createQueryBuilder().insert().into(Product).values(productsToSave).execute();

          const response = await request(app.getHttpServer()).get("/api/products");
          expect(response.status).toBe(200);
          expect(response.body).toHaveLength(4);
        });

        it("should return products based on title", async () => {
            await dataSource.createQueryBuilder().insert().into(Product).values(productsToSave).execute();
  
            const response = await request(app.getHttpServer()).get("/api/products?title=laptop");
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(1);
        });

        it("should return products based on minPrice & maxPrice", async () => {
            await dataSource.createQueryBuilder().insert().into(Product).values(productsToSave).execute();
  
            const response = await request(app.getHttpServer()).get("/api/products?minPrice=20&maxPrice=100");
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(2);
        });
    })
});