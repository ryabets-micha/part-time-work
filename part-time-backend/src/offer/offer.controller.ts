import {Body, Controller, Delete, Get, Logger, Param, Post, Put, UseGuards} from '@nestjs/common';
import {OfferService} from "./offer.service";
import {OfferDto} from "./offer.dto";
import {AuthGuard} from "../shared/auth.guard";
import {User} from "../user/user.decorator";

@Controller('api/offer')
export class OfferController {
    private logger: Logger = new Logger('NewsController');

    constructor(private offerService: OfferService) {}

    private logData(opt: any) {
        opt.user && this.logger.log('USER: ' + JSON.stringify(opt.user));
        opt.data && this.logger.log('DATA: ' + JSON.stringify(opt.data));
        opt.id && this.logger.log('OFFER: ' + JSON.stringify(opt.id));
    }

    @Get()
    @UseGuards(new AuthGuard())
    showAllOffersByUser(@User('id') user: string) {
        this.logger.log('Show all news');
        return this.offerService.showAll(user);
    }

    @Post()
    @UseGuards(new AuthGuard())
    creteOffer(@Body() data: OfferDto, @User('id') user: string) {
        this.logData({ data, user});
        return this.offerService.create(data, user);
    }

    @Get(':id')
    @UseGuards(new AuthGuard())
    readOffer(@Param('id') id: string) {
        this.logData({ id });
        return this.offerService.read(id);
    }

    @Put(':id')
    @UseGuards(new AuthGuard())
    updateOffer(
        @Param('id') id: string,
        @Body() data: Partial<OfferDto>,
        @User('id') user: string
    ) {
        this.logData({ id, data, user });
        return this.offerService.update(id, user, data);
    }

    @Delete(':id')
    @UseGuards(new AuthGuard())
    destroyOffer(@Param('id') id: string, @User('id') user: string) {
        this.logData({ id, user });
        return this.offerService.destroy(id, user);
    }
}
