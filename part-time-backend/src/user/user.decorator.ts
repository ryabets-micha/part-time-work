import {createParamDecorator} from "@nestjs/common";

// витягуєм з контексту запиту користувача або якесь з полів користувача
export const User = createParamDecorator((data, ctx) => {
    const req = ctx.switchToHttp().getRequest();
    return data ? req.user[data] : req.user;
});
