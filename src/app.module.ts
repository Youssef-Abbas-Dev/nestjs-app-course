import { ClassSerializerInterceptor, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { ReviewsModule } from './reviews/reviews.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products/product.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './users/user.entity';
import { Review } from './reviews/review.entity';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { UploadsModule } from './uploads/uploads.module';
import { MailModule } from './mail/mail.module';
import { LoggerMiddleware } from './utils/middlewares/logger.middleware';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';


@Module({
    imports: [
        ProductsModule,
        UsersModule,
        ReviewsModule,
        UploadsModule,
        MailModule,
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                return {
                    type: 'postgres',
                    database: config.get<string>("DB_DATABASE"),
                    username: config.get<string>("DB_USERNAME"),
                    password: config.get<string>("DB_PASSWORD"),
                    port: config.get<number>("DB_PORT"),
                    host: 'localhost',
                    synchronize: process.env.NODE_ENV !== 'production',
                    entities: [Product, User, Review]
                }
            }
        }),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env.${process.env.NODE_ENV}`
        }),
        ThrottlerModule.forRoot([
            {
               name: 'short',
               ttl: 4000, // 4 seconds
               limit: 3, // 3 requests every 4 seconds for a client
            },
            {
                name: 'meduim',
                ttl: 10000, // 10 seconds
                limit: 7 // 7 requests every 10 seconds for a client
            },
            {
                name: 'long',
                ttl: 60000, // 60 seconds
                limit: 15 // 15 requests every 60 seconds for a client
            }
        ])
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: ClassSerializerInterceptor
        },
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        }
    ]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LoggerMiddleware)
            .exclude({  path: 'api/products', method: RequestMethod.POST })
            .forRoutes(
            {
                path: 'api/products',
                method: RequestMethod.ALL
            });

        // consumer
        //   .apply(helmet())
        //   .forRoutes({ path: 'api/products', method: RequestMethod.ALL })
    }
}
