import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    NotFoundException,
    Put,
    Delete,
    Req,
    Res,
    Headers,
} from "@nestjs/common";
import { Request, Response } from 'express';
import { CreateProductDto } from "./dtos/create-product.dto";
import { UpdateProductDto } from "./dtos/update-product.dto";
type ProductType = { id: number, title: string, price: number }

@Controller("api/products")
export class ProductsController {
    private products: ProductType[] = [
        { id: 1, title: 'book', price: 10 },
        { id: 2, title: 'pen', price: 5 },
        { id: 3, title: 'laptop', price: 400 },
    ];

    // // POST: ~/api/products/express-way
    // @Post("express-way")
    // public createNewProductExpressWay(
    //     @Req() req: Request,
    //     @Res({ passthrough: true }) res: Response,
    //     @Headers() headers: any) {

    //     const newProduct: ProductType = {
    //         id: this.products.length + 1,
    //         title: req.body.title,
    //         price: req.body.price
    //     }
    //     this.products.push(newProduct);
    //     console.log(headers);
    //     console.log(req.headers);

    //     res.status(201).json(newProduct);

    //     // res.cookie('authCookie', 'this is a cookie', {
    //     //     httpOnly: true,
    //     //     maxAge: 120,
    //     // })
    // }

    // POST: ~/api/products
    @Post()
    public createNewProduct(@Body() body: CreateProductDto) {
        const newProduct: ProductType = {
            id: this.products.length + 1,
            title: body.title,
            price: body.price
        }
        this.products.push(newProduct);
        return newProduct;
    }

    // GET: ~/api/products
    @Get()
    public getAllProducts() {
        return this.products;
    }

    // GET: ~/api/products/:id
    @Get(":id")
    public getSingleProduct(@Param("id") id: string) {
        const product = this.products.find(p => p.id === parseInt(id));
        if (!product) throw new NotFoundException("product not found");
        return product;
    }

    // PUT: ~/api/products/:id
    @Put(":id")
    public updateProduct(@Param('id') id: string, @Body() body: UpdateProductDto) {
        const product = this.products.find(p => p.id === parseInt(id));
        if (!product) throw new NotFoundException("product not found");

        console.log(body);
        return { message: 'product updated successfully with id ' + id };
    }

    // DELETE: ~/api/products/:id
    @Delete(":id")
    public deleteProduct(@Param("id") id: string) {
        const product = this.products.find(p => p.id === parseInt(id));
        if (!product) throw new NotFoundException("product not found");
        return { message: 'product deleted' };
    }
}