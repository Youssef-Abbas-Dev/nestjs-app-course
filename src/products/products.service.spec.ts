import { Test, TestingModule } from "@nestjs/testing";
import { ProductsService } from "./products.service";
import { UsersService } from "../users/users.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Product } from "./product.entity";
import { Repository } from "typeorm";
import { CreateProductDto } from "./dtos/create-product.dto";

describe('ProductsService', () => {
    let productsService: ProductsService;
    let productsRepository: Repository<Product>;
    const REPOSITORY_TOKEN = getRepositoryToken(Product);
    const createProductDto: CreateProductDto = {
        title: 'book',
        description: 'about this book',
        price: 10
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductsService,
                { 
                    provide: UsersService, 
                    useValue: {
                        getCurrentUser: jest.fn((userId: number) => Promise.resolve({ id: userId })) 
                    } 
                },
                { 
                    provide: REPOSITORY_TOKEN, 
                    useValue: {
                        create: jest.fn((dto: CreateProductDto) => dto),
                        save: jest.fn((dto: CreateProductDto) => Promise.resolve({ ...dto, id: 10 }))
                    } 
                }
            ]
        }).compile();

        productsService = module.get<ProductsService>(ProductsService);
        productsRepository = module.get<Repository<Product>>(REPOSITORY_TOKEN);
    });

    it("should product service be defined", () => {
        expect(productsService).toBeDefined();
    });

    it("should productsRepository be defined", () => {
        expect(productsRepository).toBeDefined();
    });

    // Create new Product Tests
    describe('createProduct()', () => { 
      it("should call 'create' method in product repository", async () => {
        await productsService.createProduct(createProductDto, 1);
        expect(productsRepository.create).toHaveBeenCalled();
        expect(productsRepository.create).toHaveBeenCalledTimes(1);
      });

      it("should call 'save' method in product repository", async () => {
        await productsService.createProduct(createProductDto, 1);
        expect(productsRepository.save).toHaveBeenCalled();
        expect(productsRepository.save).toHaveBeenCalledTimes(1);
      });

      it("should create a new product", async () => {
        const result = await productsService.createProduct(createProductDto, 1);
        expect(result).toBeDefined();
        expect(result.title).toBe("book");
        expect(result.id).toBe(10);
      });
    })
})