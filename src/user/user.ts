/* eslint-disable prettier/prettier */
import { Role } from "../auth/models/role.enum";

export class User {
    id: number;
    username: string;
    password: string;
    roles: string[];
 
    constructor(id: number, username: string, password: string, roles: Role[]) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.roles = roles;
    }
}

