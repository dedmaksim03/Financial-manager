import { Category } from "src/categories/category.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    username: string 

    @Column()
    password: string

    @Column()
    refresh_token?: string

    @Column()
    expires: Date

    @OneToMany(() => Category, (Category) => Category.user)
    categories: Category[]
}