export class UserAuth {
    id: string;
    email: string;

    constructor(user: UserAuth) {
        Object.assign(this, user);
    }
}
