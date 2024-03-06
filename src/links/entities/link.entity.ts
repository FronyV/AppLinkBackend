import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Link {
    @PrimaryGeneratedColumn('uuid')
    idLink: string

    @Column('varchar')
    image: string

    @Column('varchar')
    label: string

    @Column('varchar')
    link: string

    @ManyToOne(
        ()=> User,
        (user) => user.links,
        {onDelete: "CASCADE"}
    )
    user : User
}
