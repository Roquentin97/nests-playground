import { CreateUserDTO, MinUserDto } from './users.dto';
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { User } from "./user.entity";

export type UserIDs = {id: number} | {email: string}
@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>, private dataSource: DataSource) {}

    sanitize(user: User, target: 'min'|'safe'): Partial<User>;
    sanitize(user: User, properties: (keyof User)[]): Partial<User>;
    sanitize(user: User, target: (keyof User)[]|'min'|'safe')
    : Partial<User> {
        if (target === 'min') 
            return {id: user.id, email: user.email}
        if (target === 'safe') {
            const {password, ...rest} = user;
            return rest;
        }   
        let dto = {};
        target.forEach(k => {
            dto[k] = user[k];
        });
        return dto;
    }
    async create(dto: CreateUserDTO) {
        let user = new User();
        user.email = dto.email;
        user.password = dto.password;
        return await this.userRepository.save(user);
    }

    async findAll(){
        return this.userRepository.find();
    }

    async findOne(id: UserIDs) {
        let user = await this.userRepository.findOneBy(id);
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async remove(id: number) {
        await this.userRepository.delete(id)
    }
}