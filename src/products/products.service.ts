import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateProductDto } from "./dtos/create-product.dto";
import { UpdateProductDto } from "./dtos/update-product.dto";
import { Repository, Like, Between } from "typeorm";
import { Product } from "./product.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersService } from "../users/users.service";


@Injectable()
export class ProductsService {

    constructor(
        @InjectRepository(Product)
        private readonly productsRepository: Repository<Product>,

        private readonly usersService: UsersService
    ) { }


    /**
     *  Create new product
     *  @param dto data for creating new product
     *  @param userId id of the logged in user (Admin)
     *  @returns the created product from the database
     */
    public async createProduct(dto: CreateProductDto, userId: number) {
        const user = await this.usersService.getCurrentUser(userId);
        const newProduct = this.productsRepository.create({
            ...dto,
            title: dto.title.toLowerCase(),
            user
        });
        return this.productsRepository.save(newProduct);
    }

    /**
     *  Get all products
     *  @returns collection of products
     */
    public getAll(title?: string,minPrice?: string, maxPrice?: string) {
        const filters = {
            ...(title ? { title: Like(`%${title.toLowerCase()}%`) } : {}),
            ...(minPrice && maxPrice ? { price: Between(parseInt(minPrice), parseInt(maxPrice)) } : {})
        }
        return this.productsRepository.find({ where: filters });
    }

    /**
     *  Get one product by id
     *  @param id id of the product
     *  @returns product from the database
     */
    public async getOneBy(id: number) {
        const product = await this.productsRepository.findOne({ where: { id } });
        if (!product) throw new NotFoundException("product not found");
        return product;
    }

    /**
     *  Update product
     *  @param id id of the product
     *  @param dto data for updating the exsiting product
     *  @returns the updated product
     */
    public async update(id: number, dto: UpdateProductDto) {
        const product = await this.getOneBy(id);

        product.title = dto.title ?? product.title;
        product.description = dto.description ?? product.description;
        product.price = dto.price ?? product.price;

        return this.productsRepository.save(product);
    }

    /**
     *  Delete product
     *  @param id id of the product
     *  @returns a success message
     */
    public async delete(id: number) {
        const product = await this.getOneBy(id);
        await this.productsRepository.remove(product);
        return { message: 'product deleted successfully' };
    }
}