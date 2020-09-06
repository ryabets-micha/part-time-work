import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {UserEntity} from "../user/user.entity";
import {Sex, Status} from "../shared/part-time-backend.types";

@Entity('news')
export class OfferEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    updated: Date;

    @Column('text')
    title: string;

    @Column('text')
    description: string;

    @Column('text')
    sex: Sex;

    @Column('datetime')
    dateFrom: Date;

    @Column('datetime')
    dateTo: Date;

    @Column('text')
    status: Status;

    @Column('text')
    payment: string;

    @Column('text')
    workerCount: string;

    @ManyToOne(type => UserEntity, creator => creator.offers)
    creator: UserEntity;

    @ManyToMany(type => UserEntity, user => user.selectedOffers)
    respondedPeoples: UserEntity[];
}
