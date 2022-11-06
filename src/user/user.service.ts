/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { User } from './user';
import { Role } from '../auth/models/role.enum';

@Injectable()
export class UserService {
  private users: User[] = [
    new User(1, 'admin', 'admin', [
      Role.Read_all,
      Role.Create_all,
      Role.Update_all,
      Role.Delete_all,
    ]),
    new User(2, 'UserRead', 'UserRead', [Role.Read_all]),
    new User(3, 'UserWrite', 'UserWrite', [Role.Create_all, Role.Update_all]),
    new User(4, 'UserDelete', 'UserDelete', [Role.Delete_all]),
    new User(5, 'UserRestaurante', 'UserRestaurante', [Role.Read_restaurante]),
    new User(6, 'UserProducto', 'UserProducto', [Role.Read_Producto]),
    new User(7, 'UserCultura', 'UserCultura', [Role.Read_Cultura]),
    new User(8, 'UserReceta', 'UserReceta', [Role.Read_receta]),
    new User(9, 'UserPais', 'UserPais', [Role.Read_pais]),
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
