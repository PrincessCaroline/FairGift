export class UserDto {
  id: string;
  name: string;
  email: string;

  constructor(user: UserDto) {
    Object.assign(this, user);
  }
}
