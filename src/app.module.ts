import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { ReviewsModule } from './reviews/reviews.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products/product.entity';

@Module({
    imports: [
        ProductsModule, 
        UsersModule, 
        ReviewsModule,
        TypeOrmModule.forRoot({
            type: 'postgres',
            database: 'nestjs-app-db',
            username: 'postgres',
            password: '547563001',
            port: 5432,
            host: 'localhost',
            synchronize: true, // only in development
            entities: [Product]
        })
    ],
})
export class AppModule {}
