import { ApiProperty, PartialType, OmitType } from '@nestjs/swagger';
import { RegisterUserDto } from 'src/modules/auth/dto/register-user.dto';

export class UpdateUsuarioDto extends PartialType(
  OmitType(RegisterUserDto, ['password', 'username', 'email'] as const),
) {}
