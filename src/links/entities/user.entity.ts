import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Link } from "./link.entity";

@Entity()
export class User{
    @PrimaryGeneratedColumn('uuid')
    userID: string

    @Column({
        type: 'varchar',
        unique: true,
    })
    name: string

    @Column('varchar', {
        select: false
    })
    password: string;

    @Column('boolean',{
        default: true
    })
    isActive: boolean;

    @Column('set', {
        enum: ['user', 'ghost', 'admin'],
        default: ['user', 'ghost']
    })
    roles: string[]

    @Column('varchar')
    perfilImage: string

    @OneToMany(
        ()=> Link,
        (link) => link.user,
        { cascade: true, eager: true }
    )
    links : Link[]


}