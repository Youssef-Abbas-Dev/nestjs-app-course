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
import { UserType } from "../utils/enums";
import { ApiQuery, ApiOperation, ApiResponse, ApiSecurity } from "@nestjs/swagger";


@Controller("api/products")
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
    ) {}

    // POST: ~/api/products
    @Post()
    @UseGuards(AuthRolesGuard)
    @Roles(UserType.ADMIN)
    @ApiSecurity('bearer')
    public createNewProduct(@Body() body: CreateProductDto, @CurrentUser() payload: JWTPayloadType) {
        return this.productsService.createProduct(body, payload.id);
    }

    // GET: ~/api/products
    @Get()
    @ApiResponse({ status: 200, description: 'products fetched successfully' })
    @ApiOperation({ summary: 'Get a collection of products' })
    @ApiQuery({
        name: 'title',
        required: false,
        type: 'string',
        description: 'search based on product title'
    })
    @ApiQuery({
        name: 'minPrice',
        required: false,
        type: 'string',
        description: 'minimum price'
    })
    @ApiQuery({
        name: 'maxPrice',
        required: false,
        type: 'string',
        description: 'maximum price',
    })
    public getAllProducts(
        @Query('title') title?: string,
        @Query('minPrice') minPrice?: string,
        @Query('maxPrice') maxPrice?: string
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
    @ApiSecurity('bearer')
    public updateProduct(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateProductDto) {
        return this.productsService.update(id, body);
    }

    // DELETE: ~/api/products/:id
    @Delete(":id")
    @UseGuards(AuthRolesGuard)
    @Roles(UserType.ADMIN)
    @ApiSecurity('bearer')
    public deleteProduct(@Param("id", ParseIntPipe) id: number) {
      return this.productsService.delete(id);
    }
}