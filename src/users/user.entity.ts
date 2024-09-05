import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany
} from "typeorm";
import { CURRENT_TIMESTAMP } from '../utils/constants';
import { Product } from '../products/product.entity';
import { Review } from '../reviews/review.entity';
import { UserType } from '../utils/enums';


@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: '150', nullable: true })
    username: string;

    @Column({ type: 'varchar', length: '250', unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ type: 'enum', enum: UserType, default: UserType.NORMAL_USER })
    userType: UserType;

    @Column({ default: false })
    isAccountVerified: boolean;

    @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP, onUpdate: CURRENT_TIMESTAMP })
    updatedAt: Date;

    @OneToMany(() => Product, (product) => product.user)
    products: Product[];

    @OneToMany(() => Review, (review) => review.user)
    reviews: Review[];
}