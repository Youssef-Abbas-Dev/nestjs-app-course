import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    ParseIntPipe,
    UseGuards,
    Query
} from "@nestjs/common";
import { CreateProductDto } from "./dtos/create-product.dto";
import { UpdateProductDto } from "./dtos/update-product.dto";
import { ProductsService } from "./products.service";
import { AuthRolesGuard } from '../users/guards/auth-roles.guard';
import { CurrentUser } from "../users/decorators/current-user.decorator";
import { JWTPayloadType } from '../utils/types';
import { Roles } from "../users/decorators/user-role.decorator";
import { UserType } from "src/utils/enums";


@Controller("api/products")
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
    ) {}

    // POST: ~/api/products
    @Post()
    @UseGuards(AuthRolesGuard)
    @Roles(UserType.ADMIN)
    public createNewProduct(@Body() body: CreateProductDto, @CurrentUser() payload: JWTPayloadType) {
        return this.productsService.createProduct(body, payload.id);
    }

    // GET: ~/api/products
    @Get()
    public getAllProducts(
        @Query('title') title: string,
        @Query('minPrice') minPrice: string,
        @Query('maxPrice') maxPrice: string
    ) {
        return this.productsService.getAll(title,minPrice,maxPrice)
    }

    // GET: ~/api/products/:id
    @Get(":id")
    public getSingleProduct(@Param("id", ParseIntPipe) id: number) {
        return this.productsService.getOneBy(id);
    }

    // PUT: ~/api/products/:id
    @Put(":id")
    @UseGuards(AuthRolesGuard)
    @Roles(UserType.ADMIN)
    public updateProduct(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateProductDto) {
        return this.productsService.update(id, body);
    }

    // DELETE: ~/api/products/:id
    @Delete(":id")
    @UseGuards(AuthRolesGuard)
    @Roles(UserType.ADMIN)
    public deleteProduct(@Param("id", ParseIntPipe) id: number) {
      return this.productsService.delete(id);
    }
}