import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateProductDto } from "./dtos/create-product.dto";
import { UpdateProductDto } from "./dtos/update-product.dto";

type ProductType = { id: number, title: string, price: number }

@Injectable()
export class ProductsService {

    private products: ProductType[] = [
        { id: 1, title: 'book', price: 10 },
        { id: 2, title: 'pen', price: 5 },
        { id: 3, title: 'laptop', price: 400 },
    ];


    /**
     *  Create new product
     */
    public createProduct({ title, price }: CreateProductDto) {
        const newProduct: ProductType = {
            id: this.products.length + 1,
            title,
            price
        }
        this.products.push(newProduct);
        return newProduct;
    }

    /**
     *  Get all products
     */
    public getAll() {
        return this.products;
    }


    /**
     *  Get one product by id
     */
    public getOneBy(id: number) {
        const product = this.products.find(p => p.id === id);
        if (!product) throw new NotFoundException("product not found");
        return product;
    }

    /**
     *  Update product
     */
    public update(id: string, updateProductDto: UpdateProductDto) {
        const product = this.products.find(p => p.id === parseInt(id));
        if (!product) throw new NotFoundException("product not found");

        console.log(updateProductDto);
        return { message: 'product updated successfully with id ' + id };
    }


    /**
     *  Delete product
     */
    public delete(id: string) {
        const product = this.products.find(p => p.id === parseInt(id));
        if (!product) throw new NotFoundException("product not found");
        return { message: 'product deleted' };
    }
}