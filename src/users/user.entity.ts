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
import { Exclude } from "class-transformer";


@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: '150', nullable: true })
    username: string;

    @Column({ type: 'varchar', length: '250', unique: true })
    email: string;

    @Column()
    @Exclude()
    password: string;

    @Column({ type: 'enum', enum: UserType, default: UserType.NORMAL_USER })
    userType: UserType;

    @Column({ default: false })
    isAccountVerified: boolean;
    
    @Column({ nullable: true })
    verificationToken: string;

    @Column({ nullable: true })
    resetPasswordToken: string;

    @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP, onUpdate: CURRENT_TIMESTAMP })
    updatedAt: Date;

    @Column({ nullable: true, default: null })
    profileImage: string;

    @OneToMany(() => Product, (product) => product.user)
    products: Product[];

    @OneToMany(() => Review, (review) => review.user)
    reviews: Review[];
}