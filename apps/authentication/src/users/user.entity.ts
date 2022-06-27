import { hash } from "bcrypt";
import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({unique: true, nullable: false})
    email: string

    @Column({nullable: false})
    password: string;

    @Column({default: false, nullable: false})
    confirmedEmail: boolean;

    @CreateDateColumn()
    createdAt: Date;
    
    @BeforeInsert()
     async beforeInsert() {
      this.password = await hash(this.password, 12);
      this.email = this.email.trim();
    }
}