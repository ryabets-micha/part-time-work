import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Repository} from "typeorm";

import {OfferEntity} from "./offer.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {OfferDto, OfferRo} from "./offer.dto";
import {UserEntity} from "../user/user.entity";
import {Role, Status} from "../shared/part-time-backend.types";

@Injectable()
export class OfferService {

    private static toResponseObject(offer: OfferEntity): OfferRo {
        return { ...offer, creator: offer.creator.toResponseObject() };
    }

    private static ensureOwnership(offer: OfferEntity, userId: string) {
        if (offer.creator.id !== userId) throw new HttpException('Incorrect user', HttpStatus.FORBIDDEN);
    }

    constructor(
        @InjectRepository(OfferEntity)
        private offerRepository: Repository<OfferEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ) {}

    async showAll(userId: string): Promise<OfferRo[]> {
        const offers = await this.offerRepository.find({
            where: { creator: { id: userId } },
            relations: ['creator'],
            order: { created: 'DESC' }
        });
        return offers.map(offer => OfferService.toResponseObject(offer));
    }

    async create(data: OfferDto, userId: string): Promise<OfferRo> {
        const creator = await this.userRepository.findOne({ where: { id: userId } });

        if (creator.role !== Role.EMPLOYER)
            throw new HttpException('You do not have the right to create offers', HttpStatus.FORBIDDEN);
        if (!data.status) data.status = Status.ACTIVE;

        const offer = await this.offerRepository.create({ ...data, creator });
        await this.offerRepository.save(offer);
        return OfferService.toResponseObject(offer);
    }

    async read(id: string): Promise<OfferRo> {
        const offer = await this.offerRepository.findOne({ where: { id }, relations: ['creator'] });
        if (!offer) throw new HttpException('Offer not found', HttpStatus.NOT_FOUND);
        return OfferService.toResponseObject(offer);
    }

    async update(id: string, userId: string, data: Partial<OfferDto>): Promise<OfferRo> {
        let offer = await this.offerRepository.findOne({ where: { id }, relations: ['creator'] });

        if (!offer) throw new HttpException('Offer not found', HttpStatus.NOT_FOUND);
        OfferService.ensureOwnership(offer, userId);

        await this.offerRepository.update({ id }, data);
        offer = await this.offerRepository.findOne({ where: { id }, relations: ['creator'] });
        return OfferService.toResponseObject(offer);
    }

    async destroy(id: string, userId: string): Promise<string> {
        const offer = await this.offerRepository.findOne({ where: { id }, relations: ['creator'] });

        if (!offer) throw new HttpException('Offer not found', HttpStatus.NOT_FOUND);
        OfferService.ensureOwnership(offer, userId);

        await this.offerRepository.delete({ id });
        return offer.id;
    }
}
