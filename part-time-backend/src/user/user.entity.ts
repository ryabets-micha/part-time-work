import {BeforeInsert, Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import {UserRo} from "./user.dto";
import {OfferEntity} from "../offer/offer.entity";
import {Role, Sex} from "../shared/part-time-backend.types";

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    created: Date;

    @Column('text')
    username: string;

    @Column({ type: 'varchar', unique: true })
    nickname: string;

    @Column('text')
    password: string;

    @Column('text')
    sex: Sex;

    @Column('text')
    role: Role;

    @Column('text')
    phone: string;

    @OneToMany(type => OfferEntity, offer => offer.creator)
    offers: OfferEntity[];

    @ManyToMany(type => OfferEntity, offer => offer.creator)
    selectedOffers: OfferEntity[];

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    toResponseObject(showToken: boolean = false, showOffers: boolean = false): UserRo {
        const { id, created, username, nickname, sex, role, phone, token } = this;
        const responseObject: UserRo = { id, created, username, nickname, sex, role, phone };

        if (showToken) responseObject.token = token;
        if (showOffers) responseObject.offers = this.offers || [];

        return responseObject;
    }

    async comparePassword(attempt: string) {
        return await bcrypt.compare(attempt, this.password);
    }

    private get token() {
        const { id, username } = this;
        return jwt.sign({ id, username }, process.env.SECRET, { expiresIn: '1d' });
    }
}
