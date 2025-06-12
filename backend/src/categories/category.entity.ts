import { User } from "src/users/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string 

    @Column()
    color: string

    @ManyToOne(() => User, (User) => User.categories)
    @JoinColumn({ name: 'user_id' })
    user: User
}