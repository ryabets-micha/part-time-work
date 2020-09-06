import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {UserEntity} from "./user.entity";
import {UserDto, UserRo} from "./user.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ) {}

    // список всіх користувачів
    async showAll(): Promise<UserRo[]> {
        const users = await this.userRepository.find({ relations: ['offers'] });
        return users.map(user => user.toResponseObject(false));
    }

    // вхід
    async login(data: UserDto): Promise<UserRo> {
        const { nickname, password } = data;
        const user = await this.userRepository.findOne({ where: { nickname } });

        if (!user || (!await user.comparePassword(password)))
            throw new HttpException('Invalid username/password', HttpStatus.BAD_REQUEST);

        return user.toResponseObject(true, true);
    }

    // реєстрація нового користувача
    async register(data: UserDto): Promise<UserRo> {
        const { nickname, password, passwordConfirmation } = data;
        let user = await this.userRepository.findOne({ where: { nickname } });

        if (user) throw new HttpException('User already exist', HttpStatus.BAD_REQUEST);
        if (password !== passwordConfirmation) throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);

        user = await this.userRepository.create(data);
        await this.userRepository.save(user);
        return user.toResponseObject();
    }
}
