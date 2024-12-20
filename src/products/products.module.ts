import { Module } from "@nestjs/common";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./product.entity";
import { UsersModule } from "../users/users.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
    controllers: [ProductsController],
    providers: [ProductsService],
    imports: [TypeOrmModule.forFeature([Product]), UsersModule, JwtModule],
    exports: [ProductsService]
})
export class ProductsModule {}