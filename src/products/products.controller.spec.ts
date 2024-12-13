import { Test, TestingModule } from "@nestjs/testing";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { JWTPayloadType } from "../utils/types";
import { UserType } from "../utils/enums";
import { CreateProductDto } from "./dtos/create-product.dto";


describe('ProductsController', () => {
    let productsController: ProductsController;
    let productsService: ProductsService;
    const currentUser: JWTPayloadType = { id: 1, userType: UserType.ADMIN };
    const createProductDto: CreateProductDto = {
        title: 'book',
        description: 'about this book',
        price: 10
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProductsController],
            providers: [
                { provide: ConfigService, useValue: {} },
                { provide: UsersService, useValue: {} },
                { provide: JwtService, useValue: {} },
                {
                    provide: ProductsService,
                    useValue: {
                        createProduct: jest.fn((dto: CreateProductDto, userId: number) => Promise.resolve({ ...dto, id: 1 }))
                    }
                }
            ]
        }).compile();

        productsController = module.get<ProductsController>(ProductsController);
        productsService = module.get<ProductsService>(ProductsService);
    });

    it("should productsController be defined", () => {
        expect(productsController).toBeDefined();
    });

    it("should productsService be defined", () => {
        expect(productsService).toBeDefined();
    });

    // Create new product
    describe('createNewProduct()', () => {
        it("should call 'createProduct' method in productsService", async () => {
            await productsController.createNewProduct(createProductDto, currentUser);
            expect(productsService.createProduct).toHaveBeenCalled();
            expect(productsService.createProduct).toHaveBeenCalledTimes(1);
            expect(productsService.createProduct).toHaveBeenCalledWith(createProductDto, currentUser.id);
        });

        it("should return new product with the givin data", async () => {
            const result = await productsController.createNewProduct(createProductDto, currentUser);
            expect(result).toMatchObject(createProductDto);
            expect(result.id).toBe(1);
        });
    })
})