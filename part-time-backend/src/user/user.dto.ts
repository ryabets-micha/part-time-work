import {IsNotEmpty} from "class-validator";
import {OfferEntity} from "../offer/offer.entity";
import {Role, Sex} from "../shared/part-time-backend.types";


export class UserDto {
    @IsNotEmpty()
    nickname: string;

    @IsNotEmpty()
    password: string;

    passwordConfirmation: string;
    username?: string;
    sex?: Sex;
    role?: Role;
    phone?: string;
}

export class UserRo {
    id: string;
    created: Date;
    username: string;
    nickname: string;
    sex: Sex;
    role: Role;
    phone: string;
    token?: string;
    offers?: OfferEntity[];
}
