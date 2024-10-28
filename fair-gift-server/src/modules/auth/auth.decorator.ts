import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { UserAuth } from "./auth.entity";

export const AuthUser = createParamDecorator((data: unknown, ctx: ExecutionContext): UserAuth => {
    const request = ctx.switchToHttp().getRequest();
    return new UserAuth({
        ...request.user,
    });
});