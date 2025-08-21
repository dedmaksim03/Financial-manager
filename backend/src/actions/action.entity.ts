import { Category } from "src/categories/category.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('actions')
export class Action {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    type: string 

    @Column()
    message: string

    @Column()
    sum: number

    @Column({ type: 'date' })
    date: string   

    @ManyToOne(() => Category, (Category) => Category.actions)
    @JoinColumn({ name: 'category_id' })
    category: Category
}