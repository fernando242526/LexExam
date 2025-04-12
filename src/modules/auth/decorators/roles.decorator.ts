import { SetMetadata } from '@nestjs/common';
import { RolUsuario } from '../../usuarios/entities/usuario.entity';

export const Roles = (...roles: RolUsuario[]) => SetMetadata('roles', roles);