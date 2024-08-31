import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn
} from "typeorm";
const CURRENT_TIMESTAMP = 'CURRENT_TIMESTAMP(6)';

@Entity({ name: 'products' })
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: '150'})
    title: string;

    @Column()
    description: string;

    @Column({type: 'float'})
    price: number;

    @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP, onUpdate: CURRENT_TIMESTAMP })
    updatedAt: Date;
}