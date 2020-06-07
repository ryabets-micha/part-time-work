import {Body, Controller, Get, Logger, Post, UseGuards, UsePipes, ValidationPipe} from '@nestjs/common';

import {UserService} from "./user.service";
import {UserDto} from "./user.dto";
import {AuthGuard} from "../shared/auth.guard";

@Controller()
export class UserController {
    private logger: Logger = new Logger('UserController');

    constructor(private userService: UserService) {}

    // список всіх користувачів
    @Get('api/users')
    @UseGuards(new AuthGuard())
    showAllUsers() {
        this.logger.log('Show all users');
        return this.userService.showAll();
    }

    // вхід в систему
    @Post('login')
    @UsePipes(new ValidationPipe())
    login(@Body() data: UserDto) {
        this.logger.log('LOGIN: ' + JSON.stringify(data));
        return this.userService.login(data);
    }

    // реєстрація
    @Post('register')
    @UsePipes(new ValidationPipe)
    register(@Body() data: UserDto) {
        this.logger.log('REGISTER: ' + JSON.stringify(data));
        return this.userService.register(data);
    }
}
