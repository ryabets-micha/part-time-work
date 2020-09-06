import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";

import { OfferController } from './offer.controller';
import { OfferService } from './offer.service';
import { OfferEntity } from "./offer.entity";
import {UserEntity} from "../user/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([OfferEntity, UserEntity])],
  controllers: [OfferController],
  providers: [OfferService]
})
export class OfferModule {}
