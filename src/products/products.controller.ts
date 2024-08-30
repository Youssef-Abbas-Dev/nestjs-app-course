import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    ParseIntPipe,
} from "@nestjs/common";
import { CreateProductDto } from "./dtos/create-product.dto";
import { UpdateProductDto } from "./dtos/update-product.dto";
import { ProductsService } from "./products.service";


@Controller("api/products")
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    // POST: ~/api/products
    @Post()
    public createNewProduct(@Body() body: CreateProductDto) {
        return this.productsService.createProduct(body);
    }

    // GET: ~/api/products
    @Get()
    public getAllProducts() {
        return this.productsService.getAll();
    }

    // GET: ~/api/products/:id
    @Get(":id")
    public getSingleProduct(@Param("id", ParseIntPipe) id: number) {
        return this.productsService.getOneBy(id);
    }

    // PUT: ~/api/products/:id
    @Put(":id")
    public updateProduct(@Param('id', ParseIntPipe) id: string, @Body() body: UpdateProductDto) {
        return this.productsService.update(id, body);
    }

    // DELETE: ~/api/products/:id
    @Delete(":id")
    public deleteProduct(@Param("id", ParseIntPipe) id: string) {
      return this.productsService.delete(id);
    }
}