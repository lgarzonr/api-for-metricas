import { SetMetadata } from '@nestjs/common';
import { Role } from '../models/role.enum';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);