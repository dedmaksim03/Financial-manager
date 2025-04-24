import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}