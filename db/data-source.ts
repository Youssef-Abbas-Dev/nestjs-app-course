import { Product } from "../src/products/product.entity";
import { User } from "../src/users/user.entity";
import { DataSource, DataSourceOptions } from "typeorm";
import { Review } from "../src/reviews/review.entity";
import { config } from "dotenv";

// dotenv config
config({ path: '.env' });

// data source options
export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [User, Product, Review],
    migrations: ["dist/db/migrations/*.js"]
}

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;