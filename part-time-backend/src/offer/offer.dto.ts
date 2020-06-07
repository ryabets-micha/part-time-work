import {UserRo} from "../user/user.dto";
import {Sex, Status} from "../shared/part-time-backend.types";
import {IsNotEmpty} from "class-validator";

export class OfferDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    sex: Sex;

    @IsNotEmpty()
    dateFrom: Date;

    @IsNotEmpty()
    dateTo: Date;

    @IsNotEmpty()
    payment: string;

    @IsNotEmpty()
    workerCount: string;

    status: Status;
}

export class OfferRo {
    id?: string;
    created: Date;
    updated: Date;
    title: string;
    description: string;
    sex: Sex;
    dateFrom: Date;
    dateTo: Date;
    status: Status;
    payment: string;
    workerCount: string;
    creator?: UserRo;
}
