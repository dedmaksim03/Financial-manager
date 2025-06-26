import { Action } from "src/actions/action.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @OneToMany(() => Action, (Action) => Action.category)
    actions: Action[]
}