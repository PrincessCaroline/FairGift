import { Module } from "@nestjs/common";
import { UsersModule } from "../users/users.module";
import { LoginController } from "./login.controller";
import { LoginService } from "./login.service";

@Module({
    imports: [
        UsersModule,       // Pour accéder aux fonctionnalités de gestion des utilisateurs
    ],
    controllers: [LoginController],
    providers: [LoginService],
})
export class LoginModule { }