import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { LoginDto } from "./dto/login.dto";
import * as bcrypt from "bcrypt";
import { generateToken } from "src/shared/utils/generateToken";


@Injectable()
export class LoginService {
    constructor(
        private readonly usersService: UsersService
    ) { }

    async login(loginDto: LoginDto): Promise<String> {
        const { email, password } = loginDto;

        // Cherche l'utilisateur par email
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }

        return generateToken({ id: user.id, email: user.email })
    }
}